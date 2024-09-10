import '@src/Options.css';

import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';

import { Button } from '@extension/ui';
import { exampleThemeStorage } from '@extension/storage';

const Options = () => {
  const theme = useStorage(exampleThemeStorage);
  const isLight = theme === 'light';
  const logo = isLight ? 'options/logo_horizontal.jpg' : 'options/logo_horizontal_dark.jpg';

  return (
    <div className={`App ${isLight ? 'text-gray-900 bg-slate-50' : 'text-gray-100 bg-gray-800'}`}>
      <img src={chrome.runtime.getURL(logo)} className="App-logo" alt="logo" />
      <p>
        Edit <code>pages/options/src/Options.tsx</code>
      </p>
      <Button className="mt-4">Toggle theme</Button>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Options, <div> Loading ... </div>), <div> Error Occur </div>);
