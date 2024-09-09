import '@src/Options.css';

import { useEffect, useState } from 'react';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';

import { Button } from '@extension/ui';
import { exampleThemeStorage } from '@extension/storage';
import { useDebounce } from './utils/hooks/debounce';

const Options = () => {
  const [name, setName] = useState<string>('');
  const debouncedName = useDebounce(name, 300); // 300ms debounce delay

  useEffect(() => {
    const setNameFromStorage = async () => {
      const nameFromStorage = await chrome.storage.sync.get('name');
      setName(nameFromStorage.name || '???');
    };
    setNameFromStorage();
  }, []);

  useEffect(() => {
    const logName = async () => {
      console.log('Debounced Name: ', debouncedName);
      chrome.storage.sync.set({ name: debouncedName });
      console.log('Name saved to chrome.storage.sync: ', await chrome.storage.sync.get('name'));
    };
    logName();
  }, [debouncedName]);

  const theme = useStorage(exampleThemeStorage);
  const isLight = theme === 'light';
  const logo = isLight ? 'options/logo_horizontal.svg' : 'options/logo_horizontal_dark.svg';

  return (
    <div className={`App-container ${isLight ? 'text-gray-900 bg-slate-50' : 'text-gray-100 bg-gray-800'}`}>
      <img src={chrome.runtime.getURL(logo)} className="App-logo" alt="logo" />
      <p>
        <code>Timer Extension Options</code>
      </p>
      <input
        value={name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
        type="text"
        placeholder="Enter your name!"
        className="w-23/3 pr-12 pl-3 py-2 my-10 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
      />
      <Button className="" onClick={exampleThemeStorage.toggle} theme={theme}>
        Toggle theme
      </Button>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Options, <div> Loading ... </div>), <div> Error Occur </div>);
