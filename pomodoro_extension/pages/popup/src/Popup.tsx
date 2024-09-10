import '@src/Popup.css';

import { Button, Input } from '@extension/ui';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';

import type { ComponentPropsWithoutRef } from 'react';
import { exampleThemeStorage } from '@extension/storage';

const Popup = () => {
  const theme = useStorage(exampleThemeStorage);
  const isLight = theme === 'light';
  const logo = isLight ? 'popup/logo_vertical.jpg' : 'popup/logo_vertical_dark.jpg';

  return (
    <div className={`${isLight ? 'bg-slate-50' : 'bg-gray-800'}`}>
      <header className={`flex flex-col items-center ${isLight ? 'text-gray-900' : 'text-gray-100'}`}>
        <img src={chrome.runtime.getURL(logo)} className="App-logo rounded-full" alt="logo" />
        <div className="App-title">Pomodoro Timer</div>
        <div>00:00</div>
        <Button>Start Timer</Button>
        <Button>Add Task</Button>
        <div>
          <Input type="text"></Input>
          <Button>Add</Button>
        </div>
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
