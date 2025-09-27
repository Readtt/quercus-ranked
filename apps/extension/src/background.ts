import { syncAssignments } from "./utils/averages";

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

chrome.runtime.onInstalled.addListener((details) => {
  console.log("✅ Quercus Ranked installed/updated:", details.reason);
  runSync("onInstalled");
});

chrome.runtime.onStartup.addListener(() => {
  console.log("🔄 Startup — syncing assignments");
  runSync("onStartup");
});

chrome.alarms.create("quercusPeriodicSync", {
  delayInMinutes: 1,
  periodInMinutes: 1440,
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "quercusPeriodicSync") runSync("alarm");
});

chrome.tabs.onUpdated.addListener((_, changeInfo, tab) => {
  if (changeInfo.status !== "complete") return;
  const url = tab.url || "";
  if (url.startsWith("https://q.utoronto.ca/")) {
    runSync("tabs.onUpdated");
  }
});