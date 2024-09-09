import React, { useEffect, useState } from 'react';

import { Button } from '@extension/ui';
import { exampleThemeStorage } from '@extension/storage';
import { useStorage } from '@extension/shared';

const Options: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [notificationTimeInSeconds, setNotificationTimeInSeconds] = useState<number>(1000);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const theme = useStorage(exampleThemeStorage);
  const isLight = theme === 'light';

  useEffect(() => {
    const loadData = async () => {
      const result = await chrome.storage.sync.get(['name', 'notificationTime']);
      setName(result.name || '');
      setNotificationTimeInSeconds(result.notificationTime || 1000);
    };
    loadData();

    // Check if timer is running
    chrome.storage.local.get(['timerRunning'], result => {
      setTimerRunning(result.timerRunning || false);
    });
  }, []);

  useEffect(() => {
    const saveData = async () => {
      await chrome.storage.sync.set({ name, notificationTime: notificationTimeInSeconds });
    };
    saveData();
  }, [name, notificationTimeInSeconds]);

  const handleStartTimer = () => {
    chrome.runtime.sendMessage({ action: 'startTimer' });
    setTimerRunning(true);
  };

  const handleStopTimer = () => {
    chrome.runtime.sendMessage({ action: 'stopTimer' });
    setTimerRunning(false);
  };

  const handleResetTimer = () => {
    chrome.runtime.sendMessage({ action: 'resetTimer' });
    setTimerRunning(false);
  };

  return (
    <div
      className={`${isLight ? 'bg-slate-50 text-gray-900' : 'bg-gray-800 text-gray-100'} min-h-screen flex flex-col justify-center`}>
      <div className="max-w-xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Timer Extension Options</h1>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1">
              Your Name:
            </label>
            <input
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-2 border rounded text-gray-900"
              type="text"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label htmlFor="notificationTime" className="block mb-1">
              Notification Time (seconds):
            </label>
            <input
              id="notificationTime"
              value={notificationTimeInSeconds}
              onChange={e => setNotificationTimeInSeconds(parseInt(e.target.value, 10) || 1000)}
              className="w-full p-2 border rounded text-gray-900"
              type="number"
              placeholder="Enter time for notification"
            />
          </div>
        </div>
        <div className="mt-6 space-x-2 flex justify-center">
          <Button onClick={handleStartTimer} disabled={timerRunning}>
            Start Timer
          </Button>
          <Button onClick={handleStopTimer} disabled={!timerRunning}>
            Stop Timer
          </Button>
          <Button onClick={handleResetTimer}>Reset Timer</Button>
        </div>
        <div className="mt-4 flex justify-center">
          <Button onClick={exampleThemeStorage.toggle}>Toggle theme</Button>
        </div>
      </div>
    </div>
  );
};

export default Options;
