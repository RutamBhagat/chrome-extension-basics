import '@src/Panel.css';

import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';

import type { ComponentPropsWithoutRef } from 'react';
import { exampleThemeStorage } from '@extension/storage';

const Panel = () => {
  const theme = useStorage(exampleThemeStorage);
  const isLight = theme === 'light';
  const logo = isLight ? 'devtools-panel/logo_horizontal.jpg' : 'devtools-panel/logo_horizontal_dark.jpg';

  return (
    <div className={`App ${isLight ? 'bg-slate-50' : 'bg-gray-800'}`}>
      <header className={`App-header ${isLight ? 'text-gray-900' : 'text-gray-100'}`}>
        <img src={chrome.runtime.getURL(logo)} className="App-logo" alt="logo" />
        <p>
          Edit <code>pages/devtools-panel/src/Panel.tsx</code>
        </p>
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
        (theme === 'light' ? 'bg-white text-black' : 'bg-black text-white')
      }
      onClick={exampleThemeStorage.toggle}>
      {props.children}
    </button>
  );
};

export default withErrorBoundary(withSuspense(Panel, <div> Loading ... </div>), <div> Error Occur </div>);
