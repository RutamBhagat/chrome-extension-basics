import 'webextension-polyfill';

import { exampleThemeStorage } from '@extension/storage';

exampleThemeStorage.get().then(theme => {
  console.log('theme', theme);
});

console.log('background loaded');
console.log("Edit 'chrome-extension/src/background/index.ts' and save to reload.");

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'saveSelection',
    title: 'Save Selection as City Name',
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener(info => {
  if (info.menuItemId === 'saveSelection') {
    chrome.storage.sync.set({ cityName: info.selectionText }, () => {
      console.log('City name saved:', info.selectionText);
      chrome.action.openPopup(); // Opens the popup
    });
  }
});
