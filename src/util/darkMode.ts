import { browser } from "webextension-polyfill-ts";

export async function getDarkMode():Promise<Boolean> {
  try {
    let { darkMode } = await browser.storage.local.get("darkMode");

    if (darkMode === undefined) {
      // Get user default preference if no value in storage
      const darkModeDefault = true;

      setDarkMode(darkModeDefault);
      return darkModeDefault;

    } else {
      // Return stored value
      return darkMode;
    }

  } catch (error) {
    // Return default user preference in case of an error
    console.error(`An error occurred when trying to get dark mode preference: ${error}`);
    return true;
  }
}

export async function setDarkMode(value:Boolean) {
  browser.storage.local.set({"darkMode": value})
  .then(() => console.log("Success storing dark mode preference to storage."))
  .catch((error) => console.error(`An error occurred when trying to set dark mode to storage: ${error}`))
}

export async function clearDarkMode() {
  browser.storage.local.remove("darkMode")
  .then(() => console.log("Success clearing dark mode preference from storage"))
  .catch((error) => console.error(`An error occurred when trying to clear dark mode from storage: ${error}`))
}