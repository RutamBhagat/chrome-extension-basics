import 'webextension-polyfill';

import { exampleThemeStorage } from '@extension/storage';

exampleThemeStorage.get().then(theme => {
  console.log('Theme: ', theme);
});

console.log('background loaded');
console.log("Edit 'chrome-extension/src/background/index.ts' and save to reload.");

chrome.alarms.create('timer', {
  periodInMinutes: 1 / 60,
});

chrome.alarms.onAlarm.addListener(alarm => {
  chrome.storage.local.get(['timer'], result => {
    let time = result.timer || 0;
    time += 1;
    chrome.storage.local.set({ timer: time });
    chrome.action.setBadgeText({ text: time.toString() });

    if (time % 1000 === 0) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: '/icon-34.png',
        title: 'Chrome Timer Extension',
        message: `1000 seconds have passed, timer is at ${time}`,
      });
    }
  });
});
