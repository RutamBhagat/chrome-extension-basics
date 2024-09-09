import 'webextension-polyfill';

import { exampleThemeStorage } from '@extension/storage';

exampleThemeStorage.get().then(theme => {
  console.log('Theme: ', theme);
});

console.log('background loaded');
console.log("Edit 'chrome-extension/src/background/index.ts' and save to reload.");

const ALARM_NAME = 'timerAlarm';

function startTimer() {
  chrome.alarms.create(ALARM_NAME, { periodInMinutes: 1 / 60 }); // Fires every second
  chrome.storage.local.set({ timerRunning: true });
}

function stopTimer() {
  chrome.alarms.clear(ALARM_NAME);
  chrome.storage.local.set({ timerRunning: false });
}

function resetTimer() {
  stopTimer();
  chrome.storage.local.set({ timer: 0 });
  chrome.action.setBadgeText({ text: '0' });
}

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === ALARM_NAME) {
    chrome.storage.local.get(['timer'], result => {
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startTimer') {
    startTimer();
  } else if (request.action === 'stopTimer') {
    stopTimer();
  } else if (request.action === 'resetTimer') {
    resetTimer();
  }
});

// Initialize timer state
chrome.storage.local.get(['timerRunning', 'timer'], result => {
  if (result.timerRunning) {
    startTimer();
  }
  chrome.action.setBadgeText({ text: (result.timer || '0').toString() });
});
