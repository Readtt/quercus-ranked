import { syncAssignments } from "./utils/averages";

// Simple in-flight lock so we don't overlap runs
let syncing = false;
async function runSync(trigger: string) {
  if (syncing) return;
  syncing = true;
  try {
    await syncAssignments();
    console.log(`[Quercus Ranked] Sync OK (${trigger})`);
  } catch (e) {
    console.warn(`[Quercus Ranked] Sync failed (${trigger})`, e);
  } finally {
    syncing = false;
  }
}

// On fresh install or extension update
chrome.runtime.onInstalled.addListener((details) => {
  console.log("✅ Quercus Ranked installed/updated:", details.reason);
  // Kick an initial sync shortly after install/update
  runSync("onInstalled");
});

// On browser/profile startup
chrome.runtime.onStartup.addListener(() => {
  console.log("🔄 Startup — syncing assignments");
  runSync("onStartup");
});

// Periodic background sync (every 4 hours)
chrome.alarms.create("quercusPeriodicSync", {
  delayInMinutes: 1, // first run ~1 min after service worker wakes
  periodInMinutes: 240, // every 4 hours
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "quercusPeriodicSync") runSync("alarm");
});

// Also sync when the user visits/refreshes Quercus
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") return;
  const url = tab.url || "";
  if (url.startsWith("https://q.utoronto.ca/")) {
    runSync("tabs.onUpdated");
  }
});