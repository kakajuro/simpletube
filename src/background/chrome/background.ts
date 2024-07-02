/// <reference types="chrome"/>

import { browser } from "webextension-polyfill-ts";
import { getTabStore, removeTabFromStore, updateTabStore } from "../../util/tabStore";
import { setSectionsRemovedPage, getSectionsRemovedPage } from "../../util/sectionsRemoved";

chrome.runtime.onInstalled.addListener(function () {
  // Make extension work on all pages
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [new chrome.declarativeContent.PageStateMatcher({})],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  }); 
});

// Re-inject content script if extension context invalidated
const reinjectContentScript = () => {
  console.log("REINJECTING CONTENT SCRIPT");

  if (browser.runtime?.id) {
    browser.tabs.query({currentWindow:true, active:true})
    .then(tabs => {
      let currentTabID = tabs[0].id;

      browser.scripting.executeScript({
        target: {tabId: currentTabID},
        files: ["simpletube-cs.js"]
      })
    })
  }
}

const revalidationTimeout = 20000;
let invalidateTimeout = setTimeout(async ()  => {
  if (!browser.runtime?.id) {
    clearInterval(invalidateTimeout);
    reinjectContentScript();
  }
}, revalidationTimeout);


// Tab reload event
browser.tabs.onUpdated.addListener(async function(tabId, changeInfo, tab) {
  if (changeInfo.status == "loading") {
    setSectionsRemovedPage(0);
    try {
      browser.tabs.sendMessage(tabId, "tidyWhileLoading");
      setTimeout(null, 1000);
      browser.tabs.sendMessage(tabId, "tidyWhileLoading");
    } catch (err) {
      null;
    }
  }
});

// Switch tab event (send message to popup to change sectionsRemovedPageValue)
browser.tabs.onActivated.addListener(async function (activeInfo) {

  console.log(`Tab switch detected from Tab ID: ${activeInfo.tabId}`);
  await browser.storage.local.set({"previousTab": activeInfo.previousTabId});
  let tabStore = await getTabStore();

  if (tabStore[activeInfo.tabId]) {
    setSectionsRemovedPage(tabStore[activeInfo.tabId]);
    console.log("Set sections removed page value to " + tabStore[activeInfo.tabId]);

    browser.runtime.sendMessage(null, "sectionsRemovedPageChanged");
    browser.runtime.sendMessage(null, "resetSectionsRemovedPage");
  } else {
    setSectionsRemovedPage(0);
  }

});

// Tab close event (remove data for closed tab from tab store)
browser.tabs.onRemoved.addListener(async function(tabId, removeInfo) {
  
  let tabStore = await getTabStore();

  if (tabStore[tabId]) {
    await removeTabFromStore(tabId);
  }

});

// Response functions
const tabStoreUpdate = async () => {
  let sectionsRemovedPage = await getSectionsRemovedPage();

  browser.tabs.query({active:true, currentWindow:true})
  .then((tabs) => {
    let tab:number = tabs[0].id;

    updateTabStore({"tab": tab, "sectionsRemovedPage": sectionsRemovedPage})
  })
}; 

// Message listners
browser.runtime.onMessage.addListener((msg, sender) => {
  if (msg === "BGupdateTabStore") {
    tabStoreUpdate();
  }
})
