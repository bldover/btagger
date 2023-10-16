/// <reference path="../types/spicetify.d.ts" />;
import { ManageTagsWindow, MultiAddTagWindow, MultiDeleteTagWindow } from "./tagContext/actionWindows.js";
import { Tag } from "./tagContext/client.js";
import URI = Spicetify.URI;

(async () => {
  // wait a couple seconds for the Spicetify object to finish being initialized
  while (!(Spicetify.React)) {
    await new Promise((resolve) => setTimeout(resolve, 300));
	}

  await registerSingleTaggableContextMenu();
  await registerMultiTaggableContextMenus();

  console.log("Loaded bTagger context menu items!");
})();

// TODO: get these from the DB
let availTags: Tag[]  = [{id: 1, name: "metal"}, {id: 2, name: "rock"}];

async function registerSingleTaggableContextMenu() {
  const { React } = Spicetify;
  const { Type } = URI;

  let singleTaggableTypes = [
    Type.TRACK
  ];

  function isTaggableSingle(uris: string[]) {
    let uriType = URI.fromString(uris[0]).type;
    return singleTaggableTypes.includes(uriType);
  }

  new Spicetify.ContextMenu.Item(
    "Manage Song Tags",
    uris => {
      const uri = uris[0];
      const initialTags: Tag[]  = [{id: 1, name: "metal"}];
      const manageTagsWindow = <ManageTagsWindow uri={uri} availTags={availTags} initialTags={initialTags} />;
      Spicetify.PopupModal.display({
        title: "Manage Tags",
        content: manageTagsWindow,
        isLarge: true
      })
    },
    isTaggableSingle,
    "plus-alt"
  ).register();
}

async function registerMultiTaggableContextMenus() {

  const { React } = Spicetify;
  const { Type } = URI;

  let multiTaggableTypes = [
    Type.ALBUM,
    Type.PLAYLIST,
    Type.PLAYLIST_V2,
    // Type.COLLECTION
  ];

  function isTaggableMulti(uris: string[]) {
    let uriType = URI.fromString(uris[0]).type;
    return multiTaggableTypes.includes(uriType);
  }

  new Spicetify.ContextMenu.Item(
    "Add Tag to All",
    uris => {
      const multiAddTagWindow = <MultiAddTagWindow uris={uris} availTags={availTags} />;
      Spicetify.PopupModal.display({
        title: "Add Tags",
        content: multiAddTagWindow,
        isLarge: true
      })
    },
    isTaggableMulti,
    "plus-alt"
  ).register();

  new Spicetify.ContextMenu.Item(
    "Remove Tag from All",
    uris => {
      const multiRemoveTagWindow = <MultiDeleteTagWindow uris={uris} availTags={availTags} />;
      Spicetify.PopupModal.display({
        title: "Remove Tags",
        content: multiRemoveTagWindow,
        isLarge: true
      })
    },
    isTaggableMulti,
    "minus"
  ).register();
}
