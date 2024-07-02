import { browser } from "webextension-polyfill-ts";

import type { pageChange } from "../types/types";

let defaults:pageChange =  {
  "removeShortsFromSearch": 0,
  "removeShortsFromSite": 0,
  "removeShortsPlayback": 0,
  "removeShortsRemixingThisVideo": 0,
  "removeShortsWhileWatching": 0,

  "removeNewChannelsFromSearch": 0,
  "removeLatestPostsFromSearch": 0,
  "removeLatestVideosFromSearch": 0,
  "removePreviouslyWatchedFromSearch": 0,
  "removeForYouFromSearch": 0,
  "removePeopleAlsoWatchedFromSearch": 0,
  "removeFromRelatedSearches": 0,
  "removePeopleAlsoSearchFor": 0,

  "removeAdsFromReccomendations": 0,
  "removeAdCompanionSlots": 0,
  "removeFeaturedBanners": 0,
  "removePopups": 0
}

export async function getPageChangeStore():Promise<pageChange> {

  try {
    
    let { pageChangeStore } = await browser.storage.local.get("pageChangeStore");
   
    if (pageChangeStore === undefined) {
      // Set default settings if no value in storage
      browser.storage.local.set({"pageChangeStore": defaults})
    } else {
      return pageChangeStore

    }
  } catch (error) {
    console.error(`An error occurred trying to read the changed page data: ${error}`);
  }

}

export async function incremementPageChangeStore(field:string) {

  let pageChangeStore = await getPageChangeStore();

  switch (field) {
    case "removeShortsFromSearch":
      let newRemoveShortsFromSearch = pageChangeStore.removeShortsFromSearch + 1;
      updatePageChangeStore({"removeShortsFromSearch": newRemoveShortsFromSearch});
      break;
    case "removeShortsFromSite":
      let newRemoveShortsFromSite = pageChangeStore.removeShortsFromSite + 1;
      updatePageChangeStore({"removeShortsFromSite": newRemoveShortsFromSite});
      break;
    case "removeShortsPlayback":
      let newRemoveShortsPlayback = pageChangeStore.removeShortsPlayback + 1;
      updatePageChangeStore({"removeShortsPlayback": newRemoveShortsPlayback});
      break;
    case "removeShortsRemixingThisVideo":
      let newRemoveShortsRemixingThisVideo = pageChangeStore.removeShortsRemixingThisVideo + 1;
      updatePageChangeStore({"removeShortsRemixingThisVideo": newRemoveShortsRemixingThisVideo});
      break;
    case "removeShortsWhileWatching":
      let newRemoveShortsWhileWatching = pageChangeStore.removeShortsWhileWatching + 1;
      updatePageChangeStore({"removeShortsWhileWatching": newRemoveShortsWhileWatching});
      break;
    case "removeNewChannelsFromSearch":
      let newRemoveNewChannelsFromSearch = pageChangeStore.removeNewChannelsFromSearch + 1;
      updatePageChangeStore({"removeNewChannelsFromSearch": newRemoveNewChannelsFromSearch});
      break;
    case "removeLatestPostsFromSearch":
      let newRemoveLatestPostsFromSearch = pageChangeStore.removeLatestPostsFromSearch + 1;
      updatePageChangeStore({"removeLatestPostsFromSearch": newRemoveLatestPostsFromSearch});
      break;
    case "removeLatestVideosFromSearch":
      let newRemoveLatestVideosFromSearch = pageChangeStore.removeLatestVideosFromSearch + 1;
      updatePageChangeStore({"removeLatestVideosFromSearch": newRemoveLatestVideosFromSearch});
      break;
    case "removePreviouslyWatchedFromSearch":
      let newRemovePreviouslyWatchedFromSearch = pageChangeStore.removePreviouslyWatchedFromSearch + 1;
      updatePageChangeStore({"removePreviouslyWatchedFromSearch": newRemovePreviouslyWatchedFromSearch});
      break;
    case "removeForYouFromSearch":
      let newRemoveForYouFromSearch = pageChangeStore.removeForYouFromSearch + 1;
      updatePageChangeStore({"removeForYouFromSearch": newRemoveForYouFromSearch});
      break;
    case "removePeopleAlsoWatchedFromSearch":
      let newRemovePeopleAlsoWatchedFromSearch = pageChangeStore.removePeopleAlsoWatchedFromSearch + 1;
      updatePageChangeStore({"removePeopleAlsoWatchedFromSearch": newRemovePeopleAlsoWatchedFromSearch});
      break;
    case "removeFromRelatedSearches":
      let newRemoveFromRelatedSearches = pageChangeStore.removeFromRelatedSearches + 1;
      updatePageChangeStore({"removeFromRelatedSearches": newRemoveFromRelatedSearches});
      break;
    case "removePeopleAlsoSearchFor":
      let newRemovePeopleAlsoSearchFor = pageChangeStore.removePeopleAlsoSearchFor + 1;
      updatePageChangeStore({"removePeopleAlsoSearchFor": newRemovePeopleAlsoSearchFor});
      break;
    case "removeAdsFromReccomendations":
      let newRemoveAdsFromReccomendations = pageChangeStore.removeAdsFromReccomendations + 1;
      updatePageChangeStore({"removeAdsFromReccomendations": newRemoveAdsFromReccomendations});
      break;
    case "removeAdCompanionSlots":
      let newRemoveAdCompanionSlots = pageChangeStore.removeAdCompanionSlots + 1;
      updatePageChangeStore({"removeAdCompanionSlots": newRemoveAdCompanionSlots});
      break;
    case "removeFeaturedBanners":
      let newRemoveFeaturedBanners = pageChangeStore.removeFeaturedBanners + 1;
      updatePageChangeStore({"removeFeaturedBanners": newRemoveFeaturedBanners});
      break;
    case "removePopups":
      let newRemovePopups = pageChangeStore.removePopups + 1;
      updatePageChangeStore({"removePopups": newRemovePopups});
      break;
    default:
      console.warn("Field not found when updating page change data");
      break;
  }
  
}

export async function updatePageChangeStore(data:object) {
  let { pageChangeStore } = await browser.storage.local.get("pageChangeStore");
  let newPageChangeStore = {...pageChangeStore, ...data};

  browser.storage.local.set({"pageChangeStore": newPageChangeStore})
  .catch((error) => console.error(`An error occured when updating page change data : ${error}`))
}

export async function clearPageChangeStore() {
  browser.storage.local.remove("pageChangeStore")
  .catch((error) => console.error(`An error occurred removing page change data: ${error}`));
  getPageChangeStore();
}