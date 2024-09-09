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
  if (alarm.name === 'timer') {
    chrome.storage.local.get(['timer', 'timerRunning'], result => {
      if (!result.timerRunning) {
        return; // Early return if timer is not running
      }

      let time = result.timer || 0;
      time += 1;
      chrome.storage.local.set({ timer: time });
      chrome.action.setBadgeText({ text: time.toString() });

      chrome.storage.sync.get(['notificationTime'], result => {
        let notificationTime = result.notificationTime || 1000;

        if (time % notificationTime === 0) {
          chrome.notifications.create({
            type: 'basic',
            iconUrl: '/icon-34.png',
            title: 'Chrome Timer Extension',
            message: `${notificationTime} seconds have passed, timer is at ${time}`,
          });
        }
      });
    });
  }
});
