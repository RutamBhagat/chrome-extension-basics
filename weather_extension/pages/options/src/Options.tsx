import '@src/Options.css';

import { Button, Card, CardContent, Input } from '@extension/ui/lib/components/ui';
import { useEffect, useState } from 'react';
import { withErrorBoundary, withSuspense } from '@extension/shared';

import { Save } from 'lucide-react';

const Options = () => {
  const [homeCity, setHomeCity] = useState('');
  const [unit, setUnit] = useState('metric');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Load saved options when component mounts
    chrome.storage.sync.get(['homeCity', 'unit', 'isVisible'], result => {
      if (result.homeCity) setHomeCity(result.homeCity);
      if (result.unit) setUnit(result.unit);
      if (result.isVisible !== undefined) setIsVisible(result.isVisible);
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    chrome.storage.sync.set({ homeCity, unit, isVisible }, () => {
      console.log('Options saved');
    });
  };

  const handleToggleVisibility = () => {
    const newVisibility = !isVisible;
    setIsVisible(newVisibility);
    chrome.storage.sync.set({ isVisible: newVisibility });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto relative bg-white dark:bg-gray-800">
          <CardContent className="mt-10">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Weather Extension Options</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="homeCity" className="block mb-2 text-xl text-gray-700 dark:text-gray-300">
                  Home City
                </label>
                <Input
                  id="homeCity"
                  value={homeCity}
                  onChange={e => setHomeCity(e.target.value)}
                  placeholder="Enter your home city"
                  className="w-full bg-gray-100 dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block mb-2 text-xl text-gray-700 dark:text-gray-300">
                  Preferred Temperature Unit
                </label>
                <Button
                  type="button"
                  onClick={() => setUnit(unit === 'metric' ? 'imperial' : 'metric')}
                  className="flex items-center w-full justify-center bg-gray-100 text-gray-700 hover:bg-gray-400">
                  {unit === 'metric' ? '°C' : '°F'}
                </Button>
              </div>
              <div>
                <label className="block mb-2 text-xl text-gray-700 dark:text-gray-300">Overlay Visibility</label>
                <Button
                  type="button"
                  onClick={handleToggleVisibility}
                  className="flex items-center w-full justify-center bg-gray-100 text-gray-700 hover:bg-gray-400">
                  {isVisible ? 'Visible' : 'Hidden'}
                </Button>
              </div>
              <Button type="submit" className="w-full flex justify-center items-center">
                <Save className="mr-2 h-4 w-4" />
                Save Options
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default withErrorBoundary(
  withSuspense(Options, <div className="flex justify-center items-center h-screen">Loading...</div>),
  <div className="flex justify-center items-center h-screen text-red-500">An error occurred</div>,
);
