import { Show } from "./Show";

interface IMediaProps {
  src: string;
  mimeType: string;
}

export function Media({ src, mimeType }: IMediaProps) {
  return (
    <>
      <Show if={mimeType.startsWith("video")}>
        <video width={1280} height={720} controls>
          <source src={src} />
        </video>
      </Show>

      <Show if={mimeType.startsWith("audio")}>
        <audio controls>
          <source src={src} />
        </audio>
      </Show>
    </>
  );
}
