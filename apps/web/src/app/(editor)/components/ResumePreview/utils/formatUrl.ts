export function formatUrl(url: string | undefined) {
  return url?.replaceAll("/", "/\u200B");
}
