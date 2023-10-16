export type Tag = {
  id: number,
  name: string
}

export async function addTagsToUris(uris: string[], tags: string[]) {
  if (tags.length > 0) {
    console.log(`Received request to add tags ${tags}`);
  }
  // add logic
  // return true on success, false on failure
  return true;
}

export async function removeTagsFromUris(uris: string[], tags: string[]) {
  if (tags.length > 0) {
    console.log(`Received request to remove tags ${tags}`);
  }
  // remove logic
  return true;
}
