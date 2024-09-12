import '@src/Popup.css';

import {
  Card,
  CardContent,
  CardHeader,
  ErrorState,
  Input,
  LoadingState,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  ThemeToggle,
  WeatherInfo,
} from '@extension/ui';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';

import { cn } from '@extension/ui/lib/utils';
import { exampleThemeStorage } from '@extension/storage';
import { fetchOpenWeatherData } from '@extension/shared';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

const Popup = () => {
  const theme = useStorage(exampleThemeStorage);
  const [cityName, setCityName] = useState('London');
  const [metric, setMetric] = useState<'metric' | 'imperial'>('metric');

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

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCityName(e.target.value);
  };

  const handleMetricChange = (value: string) => {
    setMetric(value as 'metric' | 'imperial');
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
          {weatherData && <WeatherInfo data={weatherData} metric={metric} />}
          <Input
            placeholder="Enter city"
            value={cityName}
            onChange={handleCityChange}
            className="p-3 my-3 rounded-lg bg-gray-100 border-gray-800 text-gray-800"
          />
          <Select value={metric} onValueChange={handleMetricChange}>
            <SelectTrigger className="w-full p-3 rounded-lg bg-gray-100 text-gray-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="w-[var(--radix-select-trigger-width)] max-h-[var(--radix-select-content-available-height)] rounded-lg bg-gray-100 text-gray-800">
              <SelectGroup>
                <SelectItem className="p-2" value="metric">
                  Celsius
                </SelectItem>
                <SelectItem className="p-2" value="imperial">
                  Fahrenheit
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  );
};

export default withErrorBoundary(
  withSuspense(Popup, <LoadingState />),
  <ErrorState error={new Error('An unexpected error occurred')} onRetry={() => {}} />,
);
