export interface settingsType {
  "preventShorts": boolean,
  "removeShortsFromSearch": boolean,
  "removeShortsFromSite": boolean,
  "removeShortsPlayback": boolean,
  "removeShortsRemixingThisVideo": boolean,
  "removeShortsWhileWatching": boolean,

  "shortsOptionsDisabled": boolean,
  "shortsOnSiteDisabled": boolean,
  
  "removeNewChannelsFromSearch": boolean,
  "removeLatestPostsFromSearch": boolean,
  "removeLastestVideosFromSearch": boolean,
  "removePreviouslyWatchedFromSearch": boolean,
  "removeForYouFromSearch": boolean,
  "removePeopleAlsoWatchedFromSearch": boolean,
  "removeFromRelatedSearches": boolean,
  "removePeopleAlsoSearchFor": boolean,

  "removeAdsFromReccomendations": boolean,
  "removeAdCompanionSlots": boolean,
  "removeFeaturedBanners": boolean,
  "removePopups": boolean
}

export interface pageChange {
  "removeShortsFromSearch": number,
  "removeShortsFromSite": number,
  "removeShortsPlayback": number,
  "removeShortsRemixingThisVideo": number,
  "removeShortsWhileWatching": number,

  "removeNewChannelsFromSearch": number,
  "removeLatestPostsFromSearch": number,
  "removeLatestVideosFromSearch": number,
  "removePreviouslyWatchedFromSearch": number,
  "removeForYouFromSearch": number,
  "removePeopleAlsoWatchedFromSearch": number,
  "removeFromRelatedSearches": number,
  "removePeopleAlsoSearchFor": number,

  "removeAdsFromReccomendations": number,
  "removeAdCompanionSlots": number,
  "removeFeaturedBanners": number,
  "removePopups": number
}

export interface tabData {
  tab: number,
  sectionsRemovedPage: number
}
