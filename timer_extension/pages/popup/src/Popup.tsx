import '@src/Popup.css';

import { Button, Card, CardContent } from '@extension/ui';
import { Moon, Sun } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';

import { cn } from '@extension/ui/lib/utils';
import { exampleThemeStorage } from '@extension/storage';

const notificationOptions = {
  type: 'basic',
  iconUrl: chrome.runtime.getURL('icon-34.png'),
  title: 'Injecting content script error',
  message: 'You cannot inject script here!',
} as const;

const Popup: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [timer, setTimer] = useState<number>(0);

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
      setName(nameFromStorage.name || 'User');
    };

    const setTimerFromStorage = async () => {
      const timerFromStorage = await chrome.storage.local.get('timer');
      setTimer(timerFromStorage.timer || 0);
    };

    setTimerFromStorage();
    setNameFromStorage();

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

  return (
    <div
      className={cn(
        'w-80 min-h-[400px] p-6 rounded-lg',
        isLight ? 'bg-white text-gray-800' : 'bg-gray-900 text-white',
      )}>
      <header className="flex justify-between items-center mb-6">
        <img src={chrome.runtime.getURL(logo)} className="w-12 h-12" alt="logo" />
        <h1 className="text-xl font-bold">Timer Extension</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={exampleThemeStorage.toggle}
          className={cn('rounded-full', isLight ? 'hover:bg-gray-200' : 'hover:bg-gray-800')}>
          {isLight ? <Moon size={20} /> : <Sun size={20} />}
        </Button>
      </header>

      <Card className={cn('mb-4', isLight ? 'bg-gray-100' : 'bg-gray-800')}>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium opacity-70">Current Time</span>
            <span className="text-lg font-bold">{currentTime}</span>
          </div>
        </CardContent>
      </Card>

      <Card className={cn('mb-4', isLight ? 'bg-gray-100' : 'bg-gray-800')}>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium opacity-70">Your Name</span>
            <span className="text-lg font-bold">{name}</span>
          </div>
        </CardContent>
      </Card>

      <Card className={cn(isLight ? 'bg-gray-100' : 'bg-gray-800')}>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium opacity-70">Timer</span>
            <span className="text-lg font-bold">{timer} seconds</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default withErrorBoundary(
  withSuspense(Popup, <div className="flex items-center justify-center h-full text-lg">Loading...</div>),
  <div className="flex items-center justify-center h-full text-lg text-red-500">An error occurred</div>,
);
