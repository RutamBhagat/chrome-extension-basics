import '@src/Popup.css';

import {
  Card,
  CardContent,
  CardHeader,
  ErrorState,
  Input,
  LoadingState,
  ThemeToggle,
  WeatherInfo,
} from '@extension/ui';
import { TWeatherData, useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { useEffect, useState } from 'react';

import { cn } from '@extension/ui/lib/utils';
import { exampleThemeStorage } from '@extension/storage';
import { fetchOpenWeatherData } from '@extension/shared';
import { useQuery } from '@tanstack/react-query';

const Popup = () => {
  const theme = useStorage(exampleThemeStorage);
  const [cityName, setCityName] = useState('London');
  const [metric, setMetric] = useState<'metric' | 'imperial'>('metric');
  const [homeCityWeatherData, setHomeCityWeatherData] = useState<TWeatherData>();

  const {
    isPending,
    isError,
    data: weatherData,
    error,
    refetch,
  } = useQuery({
    queryKey: ['weatherData', cityName, metric],
    queryFn: () => fetchOpenWeatherData(cityName, metric),
  });

  useEffect(() => {
    chrome.storage.sync.get(['homeCity'], result => {
      fetchOpenWeatherData(result.homeCity || 'Goa', metric).then(data => {
        setHomeCityWeatherData(data);
      });
    });
  }, [metric]);

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCityName(e.target.value);
  };

  const handleMetricChange = () => {
    setMetric(prevMetric => (prevMetric === 'metric' ? 'imperial' : 'metric'));
  };

  return (
    <div className={cn('min-w-80 p-4', theme === 'dark' ? 'bg-indigo-900 text-white' : 'bg-white text-gray-900')}>
      <Card className={cn('bg-transparent rounded-xl', theme === 'dark' ? 'border-indigo-700' : 'border-gray-200')}>
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <h1 className="text-2xl font-bold">Weather</h1>
          <ThemeToggle />
        </CardHeader>
        <CardContent>
          {isPending && <LoadingState />}
          {isError && <ErrorState error={error} onRetry={refetch} />}
          <WeatherInfo data={weatherData} metric={metric} />
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Enter city"
              value={cityName}
              onChange={handleCityChange}
              className="p-3 my-3 rounded-lg bg-gray-100 border-gray-800 text-gray-800 flex-grow"
            />
            <button
              onClick={handleMetricChange}
              className="p-3 my-3 rounded-lg bg-gray-100 border-gray-800 text-gray-800 h-full aspect-square">
              {metric === 'metric' ? '°C' : '°F'}
            </button>
          </div>
          <Card className="">
            <CardHeader className="pb-2">
              <h2 className="text-xl font-semibold">Home City Weather</h2>
            </CardHeader>
            <CardContent>
              {homeCityWeatherData ? <WeatherInfo data={homeCityWeatherData} metric={metric} /> : <LoadingState />}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default withErrorBoundary(
  withSuspense(Popup, <LoadingState />),
  <ErrorState error={new Error('An unexpected error occurred')} onRetry={() => {}} />,
);
