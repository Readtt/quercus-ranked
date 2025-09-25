import { getCourses, getUser } from "./utils/api";

chrome.runtime.onInstalled.addListener(async () => {
  console.log("✅ Quercus Ranked installed");
});