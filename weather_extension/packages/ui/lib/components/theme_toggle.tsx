import { MoonIcon, SunIcon } from '@radix-ui/react-icons';

import { Button } from './ui';
import { cn } from '../utils';
import { exampleThemeStorage } from '@extension/storage';
import { useStorage } from '@extension/shared';

export const ThemeToggle = ({ className }: { className?: string }) => {
  const theme = useStorage(exampleThemeStorage);
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={exampleThemeStorage.toggle}
      className={cn(
        className,
        theme === 'dark' ? 'bg-indigo-800 border-indigo-700' : 'bg-gray-100 border-gray-300',
        'rounded-full',
      )}>
      {theme === 'dark' ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
    </Button>
  );
};
