/// <reference path="../../types/spicetify.d.ts" />;
import URI = Spicetify.URI;

let { Type } = URI;

// takes a playlist or album URI and returns a list of URIs for the tracks in the collection
export async function getTracksForUri(collectionUri: string) {
  let uri = URI.fromString(collectionUri);
  let uriId = uri.id;

  if (uriId === undefined) {
    Spicetify.showNotification(`Error: URI ID was undefined while bTagging ${uri.type} with URI ${uri}`);
    return;
  }

  let songsRaw = URI.isPlaylistV1OrV2(uri) ? await getPlaylistTracks(uriId)
               : URI.isAlbum(uri) ? await getAlbumTracks(uri)
               : undefined;

  if (songsRaw === undefined) {
    console.log("bTagger: Attempted to retrieve tracks for unsupported URI type " + uri.type);
  }
  return songsRaw;
}

type AlbumItem = {
  track: {
    uri: string,
  }
}

type AlbumResponse = {
  tracks: {
    items: AlbumItem[]
  }
}

async function getAlbumTracks(albumUri: string) : Promise<string[]> {
  const { queryAlbumTracks } = Spicetify.GraphQL.Definitions;
  const { data, errors } = await Spicetify.GraphQL.Request(queryAlbumTracks, { albumUri, offset: 0, limit: 500 });

  if (errors) {
    throw errors[0].message;
  }

  const album: AlbumResponse = data.albumUnion;
  return album.tracks.items.map(item => item.track.uri);
}

type PlaylistTrack = {
  link: string,
}

type PlaylistResponse = {
  items: PlaylistTrack[]
}

async function getPlaylistTracks(uriId: string) : Promise<string[]> {
  const url = `sp://core-playlist/v1/playlist/spotify:playlist:${uriId}`;
  let playlist: PlaylistResponse = await Spicetify.CosmosAsync.get(url, { policy: { link: true } });
  return playlist.items.map(track => track.link);
}
