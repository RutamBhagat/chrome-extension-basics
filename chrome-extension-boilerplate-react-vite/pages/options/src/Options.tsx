import '@src/Options.css';

import { useEffect, useState } from 'react';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';

import { Button } from '@extension/ui';
import { exampleThemeStorage } from '@extension/storage';
import { useDebounce } from './utils/hooks/debounce';

const Options = () => {
  const [name, setName] = useState<string>('');
  const [time, setTime] = useState<number>(0);
  const debouncedName = useDebounce(name, 300); // 300ms debounce delay
  const debouncedTime = useDebounce(time, 300); // 300ms debounce delay

  useEffect(() => {
    const setNameFromStorage = async () => {
      const nameFromStorage = await chrome.storage.sync.get('name');
      setName(nameFromStorage.name || '???');
    };
    const setTimeFromStorage = async () => {
      const timeFromStorage = await chrome.storage.sync.get('notificationTime');
      setTime(timeFromStorage.notificationTime || 1000);
    };

    setNameFromStorage();
    setTimeFromStorage();
  }, []);

  useEffect(() => {
    const logName = async () => {
      console.log('Debounced Name: ', debouncedName);
      chrome.storage.sync.set({ name: debouncedName });
      console.log('Name saved to chrome.storage.sync: ', await chrome.storage.sync.get('name'));
    };
    logName();
  }, [debouncedName]);

  useEffect(() => {
    const logTime = async () => {
      console.log('Debounced Time: ', debouncedTime);
      chrome.storage.sync.set({ notificationTime: debouncedTime });
      console.log('Time saved to chrome.storage.sync: ', await chrome.storage.sync.get('notificationTime'));
    };
    logTime();
  }, [debouncedTime]);

  const theme = useStorage(exampleThemeStorage);
  const isLight = theme === 'light';
  const logo = isLight ? 'options/logo_horizontal.svg' : 'options/logo_horizontal_dark.svg';

  return (
    <div className={`App-container ${isLight ? 'text-gray-900 bg-slate-50' : 'text-gray-100 bg-gray-800'}`}>
      <img src={chrome.runtime.getURL(logo)} className="App-logo" alt="logo" />
      <p>
        <code>Timer Extension Options</code>
      </p>
      <div className="my-10 space-y-4 flex flex-col">
        <input
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          type="text"
          placeholder="Enter your name!"
          className="w-23/3 pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
        />
        <input
          value={time}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTime(parseInt(e.target.value, 10))}
          type="number"
          placeholder="Enter time for notification!"
          className="w-23/3 pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
        />
      </div>
      <Button className="" onClick={exampleThemeStorage.toggle} theme={theme}>
        Toggle theme
      </Button>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Options, <div> Loading ... </div>), <div> Error Occur </div>);
