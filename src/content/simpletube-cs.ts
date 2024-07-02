import { browser } from "webextension-polyfill-ts";

import { getExtensionRunning } from "../util/extensionRunning";
import { getSettings } from "../util/settingsHandler";
import { getSectionsRemovedPage, getSectionsRemovedTotal, setSectionsRemovedPage, setSectionsRemovedTotal } from "../util/sectionsRemoved";
import { clearPageChangeStore, incremementPageChangeStore } from "../util/pageChangeStore";
import { checkScrollDirectionIsUp } from "../util/checkScollDirection";
import { throttle } from "../util/helpers"

//MARK: START OF REMOVING FUNCTIONS

// General remove element function
const generalRemoveElement = (elementName:string, sucessMsg:string, errorMsg:string, type?:string, customSectionUpdates?:Function):number => {

  const elements = document.querySelectorAll(elementName);
  const elementsArray = [...elements];
  let status;

  elementsArray.forEach(div => {
    
    try {
      if (div.firstChild) { div.parentNode.removeChild(div) }

      if (!customSectionUpdates) {
        updateSectionsRemoveCount(type);
        handleSectionRemovedChange();        
      } else {
        customSectionUpdates();
      }

      console.log(sucessMsg);
      status = 1;
    } catch (error) {
      console.warn(`${errorMsg}: ${error}`);
      status = 0;
    }
    
  });

  return status;

}

// Remove shorts that appear next to playing videos
const removeShortsWhileWatching = () => {
  const watchNextTab = document.querySelector('ytd-watch-next-secondary-results-renderer');

  const shortsElements = watchNextTab.querySelectorAll('ytd-reel-shelf-renderer')
  const shortsElementsArray = [...shortsElements];
  
  shortsElementsArray.forEach(shortsElement => {
    try {
      if (shortsElement.firstChild) {
        const shortsContainer = shortsElement.parentNode.parentNode; 
        
        shortsContainer.parentNode.removeChild(shortsContainer);
        shortsElement.parentNode.removeChild(shortsElement);
      }

      updateSectionsRemoveCount("removeShortsWhileWatching");
      handleSectionRemovedChange();      

      console.log("Shorts section removed");
    } catch (error) {
      console.warn(`Error removing ad section: ${error}`);
    }
  })
}

// Remove Shorts on search page
const removeShortsFromSearch = () => {
  if (window.location.href.includes("https://www.youtube.com/results")) {
      generalRemoveElement('ytd-reel-shelf-renderer', "Shorts removed", "Error removing shorts", "removeShortsFromSearch");
  }
}

// Remove Shorts from the whole site
const removeShortsFromSite = () => {
  generalRemoveElement('[title="Shorts"]', "Shorts nav icon Removed", "Error removing Shorts nav icon");
  generalRemoveElement('ytd-rich-section-renderer', "Shorts section removed", "Error removing Shorts section", "removeShortsFromSite");
}

// Prevent Shorts Playback
const preventShortsPlayback = () => {
  let removeAttemptOne = generalRemoveElement('ytd-reel-video-renderer', "Individual short removed", "Error removing short", "", () => {});
  let removeAttemptTwo = generalRemoveElement('div.action-container', "Shorts Playback Prevented", "Error preventing Shorts playback", "", () => {});
  let removeAttemptThree = generalRemoveElement('ytd-shorts', "Shorts Playback Prevented", "Error preventing Shorts playback", "", () => {});

  if (removeAttemptOne || removeAttemptTwo || removeAttemptThree) {
    updateSectionsRemoveCount("removeShortsPlayback");
    handleSectionRemovedChange();
  }
}

// Remove ad slots on search page
const removeAdsFromReccomendations = () => {
  const adSections = document.querySelectorAll('ytd-ad-slot-renderer');
  const adSectionsArray = [...adSections];

  adSectionsArray.forEach(div => {
    
    try {
      if (div.firstChild) {
        const adContainer = div.parentNode.parentNode; 
        
        adContainer.parentNode.removeChild(adContainer);
        div.parentNode.removeChild(div);
      }

      updateSectionsRemoveCount("removeAdsFromReccomendations");
      handleSectionRemovedChange();      

      console.log("Ad removed");
    } catch (error) {
      console.warn(`Error removing ad section: ${error}`);
    }
    
  });
}

// Remove "Channels new to you" from search
const removeNewChannelsFromSearch = () => {
  const allShelfRenderers = document.querySelectorAll("ytd-shelf-renderer");
  const allShelfRenderersArray = [...allShelfRenderers];

  allShelfRenderersArray.forEach(div => {

    let spans = div.querySelectorAll("span");
    [...spans].forEach((span) => {
      if (span.innerText.includes("Channels new to you")) {
        try {
          if (div.firstChild) { div.parentNode.removeChild(div) }
          updateSectionsRemoveCount("removeNewChannelsFromSearch");
          handleSectionRemovedChange();          

          console.log("New Channels section removed");
        } catch (error) {
          console.log(`Error removing New Channels sections`);
        }
      } 
    });

  });
}

// Remove "Latest Posts from ..." from search
const removeLatestPostsFromSearch = () => {
  const allShelfRenderers = document.querySelectorAll("ytd-shelf-renderer");
  const allShelfRenderersArray = [...allShelfRenderers];

  allShelfRenderersArray.forEach(div => {

    let spans = div.querySelectorAll("span");
    [...spans].forEach((span) => {
      if (span.innerText.includes("Latest posts from")) {
        try {
          if (div.firstChild) { div.parentNode.removeChild(div) }
          updateSectionsRemoveCount("removeLatestPostsFromSearch");
          handleSectionRemovedChange();          

          console.log("Latest posts section removed");
        } catch (error) {
          console.log(`Error removing latest posts sections`);
        }
      } 
    });

  });
}

// Remove "Latest Videos from ..." from search
const removeLatestVideosFromSearch = () => {
  const allShelfRenderers = document.querySelectorAll("ytd-shelf-renderer");
  const allShelfRenderersArray = [...allShelfRenderers];

  allShelfRenderersArray.forEach(div => {

    let spans = div.querySelectorAll("span");
    [...spans].forEach((span) => {
      if (span.innerText.includes("Latest from")) {
        try {
          if (div.firstChild) { div.parentNode.removeChild(div) }
          updateSectionsRemoveCount("removeLastestVideosFromSearch");
          handleSectionRemovedChange();          

          console.log("Latest videos section removed");
        } catch (error) {
          console.log(`Error removing latest sections`);
        }
      } 
    });

  });
}

// Remove "Previously watched" from search
const removePreviouslyWatchedFromSearch = () => {
  const allShelfRenderers = document.querySelectorAll("ytd-shelf-renderer");
  const allShelfRenderersArray = [...allShelfRenderers];

  allShelfRenderersArray.forEach(div => {

    let spans = div.querySelectorAll("span");
    [...spans].forEach((span) => {
      if (span.innerText.includes("Previously watched")) {
        try {
          if (div.firstChild) { div.parentNode.removeChild(div) }
          updateSectionsRemoveCount("removePreviouslyWatchedFromSearch");
          handleSectionRemovedChange();          

          console.log("Previously watched videos section removed");
        } catch (error) {
          console.log(`Error removing latest sections`);
        }
      } 
    });

  });
}

// Remove "For You" from search
const removeForYouFromSearch = () => {
  const allShelfRenderers = document.querySelectorAll("ytd-shelf-renderer");
  const allShelfRenderersArray = [...allShelfRenderers];

  allShelfRenderersArray.forEach(div => {

    let spans = div.querySelectorAll("span");
    [...spans].forEach((span) => {
      if (span.innerText.includes("For you")) {
        try {
          if (div.firstChild) { div.parentNode.removeChild(div) }
          updateSectionsRemoveCount("removeForYouFromSearch");
          handleSectionRemovedChange();          

          console.log("For you section removed");
        } catch (error) {
          console.log(`Error removing latest sections`);
        }
      } 
    });

  });
}

// Remove "People Also Watched" from search
const removePeopleAlsoWatchedFromSearch = () => {
  const allShelfRenderers = document.querySelectorAll("ytd-shelf-renderer");
  const allShelfRenderersArray = [...allShelfRenderers];

  allShelfRenderersArray.forEach(div => {

    let spans = div.querySelectorAll("span");
    [...spans].forEach((span) => {
      if (span.innerText.includes("People also watched")) {
        try {
          if (div.firstChild) { div.parentNode.removeChild(div) }
          updateSectionsRemoveCount("removePeopleAlsoWatchedFromSearch");
          handleSectionRemovedChange();          

          console.log("People also watched section removed");
        } catch (error) {
          console.log(`Error removing latest sections`);
        }
      } 
    });

  });
}

// Remove "From Related Searches" from search
const removeFromRelatedSearches = () => {
  const allShelfRenderers = document.querySelectorAll("ytd-shelf-renderer");
  const allShelfRenderersArray = [...allShelfRenderers];

  allShelfRenderersArray.forEach(div => {

    let spans = div.querySelectorAll("span");
    [...spans].forEach((span) => {
      if (span.innerText.includes("From related searches")) {
        try {
          if (div.firstChild) { div.parentNode.removeChild(div) }
          updateSectionsRemoveCount("removeFromRelatedSearches");
          handleSectionRemovedChange();          

          console.log("From related searches removed");
        } catch (error) {
          console.log(`Error removing latest sections`);
        }
      } 
    });

  });
}

// Remove "People Also Search For" from search
const removePeopleAlsoSearchFor = () => {
  const allShelfRenderers = document.querySelectorAll("ytd-shelf-renderer");
  const allShelfRenderersArray = [...allShelfRenderers];

  allShelfRenderersArray.forEach(div => {

    let spans = div.querySelectorAll("span");
    [...spans].forEach((span) => {
      if (span.innerText.includes("People also search for")) {
        try {
          if (div.firstChild) { div.parentNode.removeChild(div) }
          updateSectionsRemoveCount("removePeopleAlsoSearchFor");
          handleSectionRemovedChange();          

          console.log("People also search for section removed");
        } catch (error) {
          console.log(`Error removing latest sections`);
        }
      } 
    });

  });

  const cardListRenderers = document.querySelectorAll("ytd-horizontal-card-list-renderer");
  const cardListRenderersArray = [...cardListRenderers];

  cardListRenderersArray.forEach(div => {

    let spans = div.querySelectorAll("span");
    [...spans].forEach((span) => {
      if (span.innerText.includes("People also search for")) {
        try {
          if (div.firstChild) { div.parentNode.removeChild(div) }
          updateSectionsRemoveCount("removePeopleAlsoSearchFor");
          handleSectionRemovedChange();          

          console.log("People also search for section removed");
        } catch (error) {
          console.log(`Error removing latest sections`);
        }
      } 
    });

  });
}

// Remove featured banners
const removeFeaturedBanners = () => {
  generalRemoveElement("ytd-statement-banner-renderer", "Featured Banner removed", "Error removing featured banner", "removeFeaturedBanners");
  generalRemoveElement("ytd-brand-video-shelf-renderer", "Featured Banner removed", "Error removing featured banner", "removeFeaturedBanners");
  generalRemoveElement("ytd-banner-promo-renderer", "Promotional banner removed", "Error removing promotional banner", "removeFeaturedBanners");
}

// Remove Shorts Remixing This Video
const removeShortsRemixingThisVideo = () => {
  const allShelfRenderers = document.querySelectorAll("ytd-reel-shelf-renderer");
  const allShelfRenderersArray = [...allShelfRenderers];

  allShelfRenderersArray.forEach(div => {

    let spans = div.querySelectorAll("span");
    [...spans].forEach((span) => {
      if (span.innerText.includes("Shorts remixing this video")) {
        try {
          if (div.firstChild) { div.parentNode.removeChild(div) }
          updateSectionsRemoveCount("removeShortsRemixingThisVideo");
          handleSectionRemovedChange();          

          console.log("Shorts remixing this video section removed");
        } catch (error) {
          console.log(`Error removing shorts remixing this video section`);
        }
      } 
    });

  });
}

// Remove popups
const removePopups = () => {
  generalRemoveElement("ytd-popup-container", "Removed Promotional Popup", "Error removing promotional popup", "removePopups");
}

// Remove ad companion slots
const removeAdCompanions = () => {
  generalRemoveElement("ytd-companion-slot-renderer", "Removed ad companion widget", "Error removing ad companion widget", "removeAdCompanionSlots");
}

//MARK: END OF REMOVING FUNCTIONS

// Scroll event handler
const handleScrollEvent = (returnedFunction) => {

  let scrollableElement = document.body;

  scrollableElement.addEventListener("wheel", (event) => {
    if (!checkScrollDirectionIsUp(event)) {
      returnedFunction();
    }
  });

} 

// Handle sections remove change
const handleSectionRemovedChange = (type?:String) => {
  if (type === "Page") {
    browser.runtime.sendMessage(null, `sectionsRemoved${type}Changed`)
    .catch((error) => console.warn("Could not establish connection. Receiving end does not exist - from HSRC (ignore)")) 
  } else {
    browser.runtime.sendMessage(null, `sectionsRemovedBothChanged`) 
    .catch((error) => console.warn("Could not establish connection. Receiving end does not exist - from HSRC (ignore)")) 
  }
}

// Update the sections removed ocunt when a section is removed + page change data
const updateSectionsRemoveCount = async (type:string) => {
  let newSectionsRemovedPage = await getSectionsRemovedPage();
  let newSectionsRemovedTotal = await getSectionsRemovedTotal();

  newSectionsRemovedPage +=1;
  newSectionsRemovedTotal +=1;

  setSectionsRemovedPage(newSectionsRemovedPage);
  setSectionsRemovedTotal(newSectionsRemovedTotal);

  await incremementPageChangeStore(type);

  browser.runtime.sendMessage("BGupdateTabStore");
}

// Check extension is running
async function checkExtensionRunning () {
  let extensionRunning = await getExtensionRunning();
  let settings = await getSettings();

  if (extensionRunning) {
    console.log("simpletube content script now running...");
    
    // Remove shorts from search
    if (settings.removeShortsFromSearch) {
      removeShortsFromSearch();
      document.addEventListener('scroll', () => handleScrollEvent(removeShortsFromSearch));
      document.addEventListener('scrollend', removeShortsFromSearch);
      document.addEventListener('mousemove', throttle(removeShortsFromSearch, 500));
    }
    
    // Remove ads from search
    if (settings.removeAdsFromReccomendations) {
      removeAdsFromReccomendations();
      document.addEventListener('scroll', () => handleScrollEvent(removeAdsFromReccomendations));
      document.addEventListener('scrollend', removeAdsFromReccomendations);
      document.addEventListener('mousemove', throttle(removeAdsFromReccomendations, 500));
    }

    // Remove "Channels new to you" from search
    if (settings.removeNewChannelsFromSearch) {
      removeNewChannelsFromSearch();
      document.addEventListener('scroll', () => handleScrollEvent(removeNewChannelsFromSearch));
      document.addEventListener('scrollend', removeNewChannelsFromSearch);
      document.addEventListener('mousemove', throttle(removeNewChannelsFromSearch, 500));
    }

    // Remove "Latest Posts from ..." from search
    if (settings.removeLatestPostsFromSearch) {
      removeLatestPostsFromSearch();
      document.addEventListener('scroll', () => handleScrollEvent(removeLatestPostsFromSearch));
      document.addEventListener('scrollend', removeLatestPostsFromSearch);
      document.addEventListener('mousemove', throttle(removeLatestPostsFromSearch, 500));
    }

    // Remove "Latest Videos from ..." from search
    if (settings.removeLastestVideosFromSearch) {
      removeLatestVideosFromSearch();
      document.addEventListener('scroll', () => handleScrollEvent(removeLatestVideosFromSearch));
      document.addEventListener('scrollend', removeLatestVideosFromSearch);
      document.addEventListener('mousemove', throttle(removeLatestVideosFromSearch, 500));
    }

    // Remove "Previously watched" from search
    if (settings.removePreviouslyWatchedFromSearch) {
      removePreviouslyWatchedFromSearch();
      document.addEventListener('scroll', () => handleScrollEvent(removePreviouslyWatchedFromSearch));
      document.addEventListener('scrollend', removePreviouslyWatchedFromSearch);
      document.addEventListener('mousemove', throttle(removePreviouslyWatchedFromSearch, 500));
    }

    // Remove "For You" from search
    if (settings.removeForYouFromSearch) {
      removeForYouFromSearch();
      document.addEventListener('scroll', () => handleScrollEvent(removeForYouFromSearch));
      document.addEventListener('scrollend', removeForYouFromSearch);
      document.addEventListener('mousemove', throttle(removeForYouFromSearch, 500));
    }

    // Remove "People also watched" from search
    if (settings.removePeopleAlsoWatchedFromSearch) {
      removePeopleAlsoWatchedFromSearch();
      document.addEventListener('scroll', () => handleScrollEvent(removePeopleAlsoWatchedFromSearch));
      document.addEventListener('scrollend', removePeopleAlsoWatchedFromSearch);
      document.addEventListener('mousemove', throttle(removePeopleAlsoWatchedFromSearch, 500));
    }

    // Remove "From Related Searches" from search
    if (settings.removeFromRelatedSearches) {
      removeFromRelatedSearches();
      document.addEventListener('scroll', () => handleScrollEvent(removeFromRelatedSearches));
      document.addEventListener('scrollend', removeFromRelatedSearches);
      document.addEventListener('mousemove', throttle(removeFromRelatedSearches, 500));
    }

    // Remove "People Also Search For" from search
    if (settings.removePeopleAlsoSearchFor) {
      removePeopleAlsoSearchFor();
      document.addEventListener('scroll', () => handleScrollEvent(removePeopleAlsoSearchFor));
      document.addEventListener('scrollend', removePeopleAlsoSearchFor);
      document.addEventListener('mousemove', throttle(removePeopleAlsoSearchFor, 500));
    }

    // Remove Shorts From Site
    if (settings.removeShortsFromSite) {
      removeShortsFromSite();
      document.addEventListener('scroll', () => handleScrollEvent(removeShortsFromSite));
      document.addEventListener('scrollend', removeShortsFromSite);
      document.addEventListener('mousemove', throttle(removeShortsFromSite, 500));
    }

    // Prevent Shorts Playback
    if (settings.removeShortsPlayback) {
      preventShortsPlayback();
      document.addEventListener('scroll', () => handleScrollEvent(preventShortsPlayback));
      document.addEventListener('scrollend', preventShortsPlayback);
      document.addEventListener('mousemove', throttle(preventShortsPlayback, 500));
    }
    // Remove featured banners
    if (settings.removeFeaturedBanners) {
      removeFeaturedBanners();
      document.addEventListener('scroll', () => handleScrollEvent(removeFeaturedBanners));
      document.addEventListener('scrollend', () => handleScrollEvent(removeFeaturedBanners));
      document.addEventListener('mousemove', throttle(removeFeaturedBanners, 500));
    }

    // Remove shorts remixing this video
    if (settings.removeShortsRemixingThisVideo) {
      removeShortsRemixingThisVideo();
      document.addEventListener('scroll', () => handleScrollEvent(removeShortsRemixingThisVideo));
      document.addEventListener('scrollend', () => handleScrollEvent(removeShortsRemixingThisVideo));
      document.addEventListener('mousemove', throttle(removeShortsRemixingThisVideo, 500));
    }

    // Remove shorts from appearing on the reccomended sidebar
    if (settings.removeShortsWhileWatching) {
      removeShortsWhileWatching();
      document.addEventListener('scroll', () => handleScrollEvent(removeShortsWhileWatching));
      document.addEventListener('scrollend', () => handleScrollEvent(removeShortsWhileWatching));
      document.addEventListener('mousemove', throttle(removeShortsWhileWatching, 500));
    }

    // Remove popups from appearing
    if (settings.removePopups) {
      removePopups();
      document.addEventListener('scroll', () => handleScrollEvent(removePopups));
      document.addEventListener('scrollend', () => handleScrollEvent(removePopups));
      document.addEventListener('mousemove', throttle(removePopups, 500));
    }

    // Remove ad companions
    if (settings.removeAdCompanionSlots) {
      removeAdCompanions();
      document.addEventListener('scroll', () => handleScrollEvent(removeAdCompanions));
      document.addEventListener('scrollend', () => handleScrollEvent(removeAdCompanions));
      document.addEventListener('mousemove', throttle(removeAdCompanions, 500));
    }

  } else {
    console.log("paused simpletube content script");

    try {
      // [REMOVE EVENT LISTENER] Remove shorts from search
      document.removeEventListener('scroll', () => handleScrollEvent(removeShortsFromSearch));
      document.removeEventListener('scrollend', () => removeShortsFromSearch);
      document.removeEventListener('mousemove', throttle(removeShortsFromSearch, 500));

      // [REMOVE EVENT LISTENER] Remove ads from search
      document.removeEventListener('scroll', () => handleScrollEvent(removeAdsFromReccomendations));
      document.removeEventListener('scrollend', removeAdsFromReccomendations);
      document.removeEventListener('mousemove', throttle(removeAdsFromReccomendations, 500));

      // [REMOVE EVENT LISTENER] Remove "Channels new to you" from search
      document.removeEventListener('scroll', () => handleScrollEvent(removeNewChannelsFromSearch));
      document.removeEventListener('scrollend', removeNewChannelsFromSearch);
      document.removeEventListener('mousemove', throttle(removeNewChannelsFromSearch, 500));

      // [REMOVE EVENT LISTENER] Remove "Latest posts from .." from search
      document.removeEventListener('scroll', () => handleScrollEvent(removeLatestPostsFromSearch));
      document.removeEventListener('scrollend', removeLatestPostsFromSearch);
      document.removeEventListener('mousemove', throttle(removeLatestPostsFromSearch, 500));

      // [REMOVE EVENT LISTENER] Remove "Latest videos from..." from search
      document.removeEventListener('scroll', () => handleScrollEvent(removeLatestVideosFromSearch));
      document.removeEventListener('scrollend', removeLatestVideosFromSearch);
      document.removeEventListener('mousemove', throttle(removeLatestVideosFromSearch, 500));

      // [REMOVE EVENT LISTENER] Remove "Previously watched" from search
      document.removeEventListener('scroll', () => handleScrollEvent(removePreviouslyWatchedFromSearch));
      document.removeEventListener('scrollend', removePreviouslyWatchedFromSearch);
      document.removeEventListener('mousemove', throttle(removePreviouslyWatchedFromSearch, 500));

      // [REMOVE EVENT LISTENER] Remove "For You" from search
      document.removeEventListener('scroll', () => handleScrollEvent(removeForYouFromSearch));
      document.removeEventListener('scrollend', removeForYouFromSearch);
      document.removeEventListener('mousemove', throttle(removeForYouFromSearch, 500));

      // [REMOVE EVENT LISTENER] Remove "People Also Watched" from search
      document.removeEventListener('scroll', () => handleScrollEvent(removePeopleAlsoWatchedFromSearch));
      document.removeEventListener('scrollend', removePeopleAlsoWatchedFromSearch);
      document.removeEventListener('mousemove', throttle(removePeopleAlsoWatchedFromSearch, 500));

      // [REMOVE EVENT LISTENER] Remove "From Related Searches" from search
      document.removeEventListener('scroll', () => handleScrollEvent(removeFromRelatedSearches));
      document.removeEventListener('scrollend', removeFromRelatedSearches);
      document.removeEventListener('mousemove', throttle(removeFromRelatedSearches, 500));

      // [REMOVE EVENT LISTENER] Remove "People Also Search For" from search
      document.removeEventListener('scroll', () => handleScrollEvent(removePeopleAlsoSearchFor));
      document.removeEventListener('scrollend', removePeopleAlsoSearchFor);
      document.removeEventListener('mousemove', throttle(removePeopleAlsoSearchFor, 500));

      // [REMOVE EVENT LISTENER] Remove Shorts From Site
      document.removeEventListener('scroll', () => handleScrollEvent(removeShortsFromSite));
      document.removeEventListener('scrollend', removeShortsFromSite);
      document.removeEventListener('mousemove', throttle(removeShortsFromSite, 500));
       
      // [REMOVE EVENT LISTENER] Prevent Shorts Playback
      document.removeEventListener('scroll', () => handleScrollEvent(preventShortsPlayback));
      document.removeEventListener('scrollend', preventShortsPlayback);
      document.removeEventListener('mousemove', throttle(preventShortsPlayback, 500));

      // [REMOVE EVENT LISTENER] Remove Featured Banners
      document.removeEventListener('scroll', () => handleScrollEvent(removeFeaturedBanners));
      document.removeEventListener('scrollend', removeFeaturedBanners);
      document.removeEventListener('mousemove', throttle(removeFeaturedBanners, 500));

      // [REMOVE EVENT LISTENER] Remove Shorts Remixing this video
      document.removeEventListener('scroll', () => handleScrollEvent(removeShortsRemixingThisVideo));
      document.removeEventListener('scrollend', removeShortsRemixingThisVideo);
      document.removeEventListener('mousemove', throttle(removeShortsRemixingThisVideo, 500));

      // [REMOVE EVENT LISTENER] Remove Shorts While Watching Video
      document.removeEventListener('scroll', () => handleScrollEvent(removeShortsWhileWatching));
      document.removeEventListener('scrollend', removeShortsWhileWatching);
      document.removeEventListener('mousemove', throttle(removeShortsWhileWatching, 500));

      // [REMOVE EVENT LISTENER] Remove Popups
      document.removeEventListener('scroll', () => handleScrollEvent(removePopups));
      document.removeEventListener('scrollend', removePopups);
      document.removeEventListener('mousemove', throttle(removePopups, 500));

      // [REMOVE EVENT LISTENER] Remove ad companions
      document.removeEventListener('scroll', () => handleScrollEvent(removeAdCompanions));
      document.removeEventListener('scrollend', removeAdCompanions);
      document.removeEventListener('mousemove', throttle(removeAdCompanions, 500));

    } catch (error) {
      console.error(`Error removing event listeners (there may not have been any): ${error}`);
    }
  
  }
}

// Content script event listener
browser.runtime.onMessage.addListener(msg => {
  (msg === "extensionStateChanged") ? checkExtensionRunning() : null;
  (msg === "tidyWhileLoading") ? checkExtensionRunning() : null;
});

checkExtensionRunning();
setSectionsRemovedPage(0);
handleSectionRemovedChange("Page");

setTimeout(checkExtensionRunning, 1000);
console.log("simpletube loaded");
