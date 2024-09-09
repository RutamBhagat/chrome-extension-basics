import '@src/Popup.css';

import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';

import { useEffect, useState, type ComponentPropsWithoutRef } from 'react';
import { exampleThemeStorage } from '@extension/storage';

const notificationOptions = {
  type: 'basic',
  iconUrl: chrome.runtime.getURL('icon-34.png'),
  title: 'Injecting content script error',
  message: 'You cannot inject script here!',
} as const;

const Popup = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [name, setName] = useState('');

  // useEffect to set up the interval for updating the current time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Set options for 12-hour format with AM/PM
      const options: Intl.DateTimeFormatOptions = {
        hour: 'numeric', // Use 'numeric' or '2-digit'
        minute: 'numeric', // Use 'numeric' or '2-digit'
        second: 'numeric', // Use 'numeric' or '2-digit'
        hour12: true, // Enable 12-hour format
      };
      setCurrentTime(now.toLocaleTimeString(undefined, options)); // Update the current time
    };
    const setBadgeText = () => {
      chrome.action.setBadgeText({ text: 'TIME' }, () => {
        console.log('Finished setting badge text.');
      });
    };
    const setNameFromStorage = async () => {
      const nameFromStorage = await chrome.storage.sync.get('name');
      setName(nameFromStorage.name || '???');
    };

    updateTime(); // Set the initial time immediately
    const intervalId = setInterval(updateTime, 1000); // Update every second
    setBadgeText();
    setNameFromStorage();

    // Cleanup function to clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to run only once on mount

  const theme = useStorage(exampleThemeStorage);
  const isLight = theme === 'light';
  const logo = isLight ? 'popup/logo_vertical.svg' : 'popup/logo_vertical_dark.svg';

  const injectContentScript = async () => {
    const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });

    if (tab.url!.startsWith('about:') || tab.url!.startsWith('chrome:')) {
      chrome.notifications.create('inject-error', notificationOptions);
    }

    await chrome.scripting
      .executeScript({
        target: { tabId: tab.id! },
        files: ['/content-runtime/index.iife.js'],
      })
      .catch(err => {
        // Handling errors related to other paths
        if (err.message.includes('Cannot access a chrome:// URL')) {
          chrome.notifications.create('inject-error', notificationOptions);
        }
      });
  };

  return (
    <div className={`App ${isLight ? 'bg-slate-50' : 'bg-gray-800'}`}>
      <header className={`App-header ${isLight ? 'text-gray-900' : 'text-gray-100'}`}>
        <img src={chrome.runtime.getURL(logo)} className="App-logo" alt="logo" />
        <h1>Timer Extension</h1>
        <div className="card">
          <div>Time is {currentTime}</div>
        </div>
        <div className="card">
          <div>Your name is {name}</div>
        </div>
        {/* <button
            className={
              'font-bold mt-4 py-1 px-4 rounded shadow hover:scale-105 ' +
              (isLight ? 'bg-blue-200 text-black' : 'bg-gray-700 text-white')
            }
            onClick={injectContentScript}>
            Click to inject Content Script
          </button> */}
        <ToggleButton>Toggle theme</ToggleButton>
      </header>
    </div>
  );
};

const ToggleButton = (props: ComponentPropsWithoutRef<'button'>) => {
  const theme = useStorage(exampleThemeStorage);
  return (
    <button
      className={
        props.className +
        ' ' +
        'font-bold mt-4 py-1 px-4 rounded shadow hover:scale-105 ' +
        (theme === 'light' ? 'bg-white text-black shadow-black' : 'bg-black text-white')
      }
      onClick={exampleThemeStorage.toggle}>
      {props.children}
    </button>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
