import '@src/Popup.css';

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@extension/ui';
import { CloudRain, Loader2, Moon, Sun, Thermometer, Wind } from 'lucide-react';
import { TWeatherData, useStorage, withErrorBoundary, withSuspense } from '@extension/shared';

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
    <div className={cn('min-w-80 p-4', theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900')}>
      <Card className={cn('bg-transparent', theme === 'dark' ? 'border-gray-700' : 'border-gray-200')}>
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <h1 className="text-2xl font-bold">Weather</h1>
          <ThemeToggle />
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Enter city"
              value={cityName}
              onChange={handleCityChange}
              className={cn(theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300')}
            />
            <Select value={metric} onValueChange={handleMetricChange}>
              <SelectTrigger
                className={cn(
                  'w-[100px]',
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300',
                )}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">Celsius</SelectItem>
                <SelectItem value="imperial">Fahrenheit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {isPending && <LoadingState />}
          {isError && <ErrorState error={error} onRetry={refetch} />}
          {weatherData && <WeatherInfo data={weatherData} metric={metric} />}
        </CardContent>
      </Card>
    </div>
  );
};

const ThemeToggle = () => {
  const theme = useStorage(exampleThemeStorage);
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={exampleThemeStorage.toggle}
      className={cn(theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300')}>
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
};

const LoadingState = () => (
  <div className="flex justify-center items-center h-40">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

const ErrorState = ({ error, onRetry }: { error: Error; onRetry: () => void }) => (
  <div className="text-center py-4">
    <p className="text-red-500 mb-2">Error: {error.message}</p>
    <Button onClick={onRetry} variant="outline">
      Retry
    </Button>
  </div>
);

const WeatherInfo = ({ data, metric }: { data: TWeatherData; metric: string }) => (
  <div className="text-center">
    <h2 className="text-3xl font-bold mb-2">{data.name}</h2>
    <div className="flex justify-center items-center mb-4">
      <CloudRain className="h-12 w-12 mr-2" />
      <span className="text-4xl font-bold">
        {data.main.temp.toFixed(1)}°{metric === 'metric' ? 'C' : 'F'}
      </span>
    </div>
    <p className="text-lg mb-2">{data.weather[0].description}</p>
    <div className="grid grid-cols-2 gap-4 mt-4">
      <div className="flex items-center justify-center">
        <Thermometer className="h-5 w-5 mr-2" />
        <span>Feels like: {data.main.feels_like.toFixed(1)}°</span>
      </div>
      <div className="flex items-center justify-center">
        <Wind className="h-5 w-5 mr-2" />
        <span>Wind: {data.wind.speed} m/s</span>
      </div>
    </div>
  </div>
);

export default withErrorBoundary(
  withSuspense(Popup, <LoadingState />),
  <ErrorState error={new Error('An unexpected error occurred')} onRetry={() => {}} />,
);
