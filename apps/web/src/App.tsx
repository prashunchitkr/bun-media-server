import { useQuery } from "@tanstack/react-query";

import { useState } from "react";
import { For } from "../components/For";
import { Media } from "../components/Media";
import { Show } from "../components/Show";
import { getMediaUrl, getMedias } from "../core/api";

function App() {
  const [selectedId, setSelectedId] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["medias"],
    initialData: [],
    queryFn: getMedias,
  });

  return (
    <>
      <Show if={isLoading}>Loading...</Show>
      <Show if={!isLoading}>
        <ul>
          <For each={data}>
            {(media) => (
              <li
                key={media.id}
                onClick={() =>
                  setSelectedId((val) => (val === media.id ? "" : media.id))
                }
              >
                <button style={{ display: "block" }}>{media.title}</button>
                <Show if={selectedId === media.id}>
                  <Media
                    src={getMediaUrl(media.id)}
                    mimeType={media.mimeType}
                  />
                </Show>
              </li>
            )}
          </For>
        </ul>
      </Show>
    </>
  );
}

export default App;
