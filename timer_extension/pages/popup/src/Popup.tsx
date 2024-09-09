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
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
      };
      setCurrentTime(now.toLocaleTimeString(undefined, options));
    }, 1000);

    const setNameFromStorage = async () => {
      const nameFromStorage = await chrome.storage.sync.get('name');
      setName(nameFromStorage.name || '???');
    };

    const setTimerFromStorage = async () => {
      const timerFromStorage = await chrome.storage.local.get('timer');
      setTimer(timerFromStorage.timer || 0);
    };

    setTimerFromStorage();
    setNameFromStorage();

    // Listen for changes to local storage
    const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes.timer) {
        setTimer(changes.timer.newValue || 0);
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      clearInterval(intervalId);
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

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
        if (err.message.includes('Cannot access a chrome:// URL')) {
          chrome.notifications.create('inject-error', notificationOptions);
        }
      });
  };

  return (
    <div className={`App ${isLight ? 'bg-slate-50' : 'bg-gray-800'}`}>
      <header className={`App-header ${isLight ? 'text-gray-900' : 'text-gray-100'}`}>
        <img src={chrome.runtime.getURL(logo)} className="App-logo pt-4" alt="logo" />
        <div className="">
          <h1>Timer Extension</h1>
          <div className="card">
            <div>Time is {currentTime}</div>
          </div>
          <div className="card">
            <div>Your name is {name}</div>
          </div>
          <div className="card">
            <div>The timer is at: {timer} seconds</div>
          </div>
          <ToggleButton>Toggle theme</ToggleButton>
        </div>
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
