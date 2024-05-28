const BACKEND_URL = "http://localhost:3000/api";

export interface IMedia {
  id: string;
  title: string;
  mimeType: string;
}

export async function getMedias(): Promise<IMedia[]> {
  return fetch(`${BACKEND_URL}/media`).then((res) => res.json());
}

export function getMediaUrl(id: string) {
  return `${BACKEND_URL}/media/${id}`;
}
