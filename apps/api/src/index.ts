import { Elysia, NotFoundError, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";

import { prisma } from "@/core/prisma";

const app = new Elysia({
  prefix: "/api",
  serve: {
    development: process.env.NODE_ENV === "development",
    maxRequestBodySize: 5e8, // 500MB
  },
})
  .use(
    cors({
      origin: process.env.NODE_ENV === "development" ? ["*"] : [],
    })
  )
  .use(staticPlugin())
  .use(
    swagger({
      provider: "swagger-ui",
    })
  )
  .get("/", () => ({ message: "Ok" }))
  .post(
    "/upload",
    async ({ body: { title, media } }) => {
      const mediaPath = `public/uploads/${crypto.randomUUID()}.${media.name
        .split(".")
        .pop()}`;

      await Bun.write(mediaPath, media);

      const dbMedia = await prisma.media.create({
        data: {
          title,
          path: mediaPath,
          mimeType: media.type,
        },
      });

      return {
        id: dbMedia.id,
        title: dbMedia.title,
      };
    },
    {
      type: "multipart/form-data",
      body: t.Object({
        title: t.String({ minLength: 1 }),
        media: t.File({
          type: ["video", "audio"],
          maxItems: 1,
          maxSize: "500m",
        }),
      }),
    }
  )
  .get("/media", async () => {
    const medias = await prisma.media.findMany({
      select: { id: true, title: true, mimeType: true },
    });
    return medias;
  })
  .get(
    "/media/:id",
    async ({ params: { id }, set, headers }) => {
      const range = headers["range"];

      const media = await prisma.media.findUnique({
        where: {
          id,
        },
      });

      if (!media) throw new NotFoundError();

      const file = Bun.file(media.path);

      const fileSize = file.size;
      const chunksize = 1 * 1e6; // 1MB
      const start = Number(range.replace(/\D/g, ""));
      const end = Math.min(start + chunksize, fileSize - 1);
      const contentLength = end - start + 1;

      set.headers["content-disposition"] = `inline; filename="${media.title}"`;
      set.headers["content-type"] = file.type;
      set.headers["content-length"] = contentLength.toString();
      set.headers["content-range"] = `bytes ${start}-${end}/${fileSize}`;

      return file.slice(start, end + 1);
    },
    {
      headers: t.Object({
        range: t.String(),
      }),
      params: t.Object({
        id: t.String({
          format: "uuid",
        }),
      }),
    }
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
