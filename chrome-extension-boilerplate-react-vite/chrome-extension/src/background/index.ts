import 'webextension-polyfill';

import { exampleThemeStorage } from '@extension/storage';

exampleThemeStorage.get().then(theme => {
  console.log('Theme: ', theme);
});

console.log('background loaded');
console.log("Edit 'chrome-extension/src/background/index.ts' and save to reload.");

// let time = 0;

// setInterval(() => {
//   time += 1;
//   console.log('Time: ', time);
// }, 1000);

chrome.alarms.create('timer', {
  periodInMinutes: 1 / 60,
});

chrome.alarms.onAlarm.addListener(alarm => {
  chrome.storage.local.get(['timer'], result => {
    let time = result.timer || 0;
    time += 1;
    chrome.storage.local.set({ timer: time });
    chrome.action.setBadgeText({ text: time.toString() });
  });
});
