import { useState } from "react";
import { Tag, addTagsToUris, removeTagsFromUris } from "./client.js";

interface TagWindowProps {
  uris: string[];
  availTags: Tag[];
}

export function MultiAddTagWindow({uris, availTags}: TagWindowProps) {

  const { React } = Spicetify;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const selectedTags: string[] = Array.from(e.currentTarget.multiAddSelect.options)
                                        .filter(opt => opt.selected)
                                        .map(opt => opt.value);
    if (await addTagsToUris(uris, selectedTags)) {
      Spicetify.showNotification(`Tags ${selectedTags} added!`);
    } else {
      Spicetify.showNotification(`Failed to add tags ${selectedTags}! :(`);
    }
    Spicetify.PopupModal.hide();
  }

  const tagOptions = availTags.sort()
    .map(tag => <option value={tag.name} key={tag.id}>{tag.name}</option>);

  return (
    <form onSubmit={handleSubmit}>
      Select tag:
      <select name="multiAddSelect" multiple={true}>{tagOptions}</select>
      <br/>
      <button>Add Tag To Songs</button>
    </form>
  )
}

export function MultiDeleteTagWindow({uris, availTags}: TagWindowProps) {

  const { React } = Spicetify;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const selectedTags: string[] = Array.from(e.currentTarget.multiDeleteSelect.options)
                                        .filter(opt => opt.selected)
                                        .map(opt => opt.value);
    if (await removeTagsFromUris(uris, selectedTags)) {
      Spicetify.showNotification(`Tag ${selectedTags} removed!`);
    } else {
      Spicetify.showNotification(`Failed to remove tag ${selectedTags}! :(`);
    }
    Spicetify.PopupModal.hide();
  }

  const tagOptions = availTags.sort()
    .map(tag => <option value={tag.name} key={tag.id}>{tag.name}</option>);

  return (
    <form onSubmit={handleSubmit}>
      Select tag:
      <select name="multiDeleteSelect" multiple={true}>{tagOptions}</select>
      <br/>
      <button>Remove Tag From Songs</button>
    </form>
  )
}

interface ManageTagWindowProps {
  uri: string;
  availTags: Tag[];
  initialTags: Tag[];
}

export function ManageTagsWindow({uri, availTags, initialTags}: ManageTagWindowProps) {
  const { React } = Spicetify;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const selectedTags: string[] = Array.from(e.currentTarget.manageSingleSelect.options)
                          .filter(opt => opt.selected)
                          .map(opt => opt.value);
    const tagsToAdd = selectedTags.filter(tag => !initialTags.map(tag => tag.name).includes(tag));
    const tagsToRemove = initialTags.map(tag => tag.name).filter(tag => !selectedTags.includes(tag));
    if (await addTagsToUris([uri], tagsToAdd) && await removeTagsFromUris([uri], tagsToRemove)) {
      Spicetify.showNotification(`Tags updated!`);
    } else {
      Spicetify.showNotification(`Failed to update tags! :(`);
    }
    Spicetify.PopupModal.hide();

  }

  const tagOptions = availTags.sort().map(tag => <option value={tag.name} key={tag.id}>{tag.name}</option>);
  const alreadyAddedTags = initialTags.map(tag => tag.name);

  return (
    <form onSubmit={handleSubmit}>
      Select tag to add:
      <select multiple={true}
              defaultValue={alreadyAddedTags}
              name="manageSingleSelect">{tagOptions}</select>
      <br/>
      <button>Update Song Tags</button>
    </form>
  )
}
