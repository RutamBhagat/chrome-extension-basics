import '@src/Popup.css';

import { Button, Card, CardContent, CardHeader, Input } from '@extension/ui/lib/components/ui';
import { CloudRain, Home, Search, Thermometer, Wind } from 'lucide-react';
import { ErrorState, SkeletonCard, ThemeToggle } from '@extension/ui';
import { TWeatherData, useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { useEffect, useState } from 'react';

import { cn } from '@extension/ui/lib/utils';
import { exampleThemeStorage } from '@extension/storage';
import { fetchOpenWeatherData } from '@extension/shared';
import { useQuery } from '@tanstack/react-query';

const Popup = () => {
  const theme = useStorage(exampleThemeStorage);
  const [cityName, setCityName] = useState('');
  const [currentCity, setCurrentCity] = useState('London');
  const [metric, setMetric] = useState<'metric' | 'imperial'>('metric');
  const [showHomeWeather, setShowHomeWeather] = useState(false);
  const [homeCityWeatherData, setHomeCityWeatherData] = useState<TWeatherData>();

  const {
    data: weatherData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['weatherData', currentCity, metric],
    queryFn: () => fetchOpenWeatherData(currentCity, metric),
  });

  useEffect(() => {
    chrome.storage.sync.get(['homeCity'], result => {
      fetchOpenWeatherData(result.homeCity || 'Goa', metric).then(data => {
        setHomeCityWeatherData(data);
      });
    });
  }, [metric]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cityName) {
      setCurrentCity(cityName);
      setCityName('');
      refetch();
    }
  };

  const handleMetricChange = () => {
    setMetric(prevMetric => (prevMetric === 'metric' ? 'imperial' : 'metric'));
  };

  const toggleHomeWeather = () => {
    setShowHomeWeather(prev => !prev);
  };

  return (
    <div className={cn('w-80 p-4', theme === 'dark' ? 'bg-indigo-900 text-white' : 'bg-white text-gray-900')}>
      <Card className={cn('bg-transparent rounded-xl', theme === 'dark' ? 'border-indigo-700' : 'border-gray-200')}>
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <h1 className="text-2xl font-bold">Weather</h1>
          <ThemeToggle />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <SkeletonCard className="w-64 h-32" lineClassName="w-64" lines={2} />
          ) : (
            <>
              {showHomeWeather && homeCityWeatherData ? (
                <WeatherInfo data={homeCityWeatherData} metric={metric} />
              ) : weatherData ? (
                <WeatherInfo data={weatherData} metric={metric} />
              ) : null}
              <SearchForm cityName={cityName} setCityName={setCityName} handleSubmit={handleSubmit} />
              <div className="flex gap-1">
                <MetricToggle metric={metric} handleMetricChange={handleMetricChange} />
                <HomeWeatherToggle showHomeWeather={showHomeWeather} toggleHomeWeather={toggleHomeWeather} />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

interface HomeWeatherToggleProps {
  showHomeWeather: boolean;
  toggleHomeWeather: () => void;
}

const HomeWeatherToggle: React.FC<HomeWeatherToggleProps> = ({ showHomeWeather, toggleHomeWeather }) => {
  return (
    <Button
      onClick={toggleHomeWeather}
      className={cn(
        'p-3 rounded-xl flex-1 ml-2 cursor-pointer',
        showHomeWeather ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-400 border-gray-800 text-gray-800',
      )}>
      <Home className="h-5 w-5 mx-auto" />
    </Button>
  );
};

interface WeatherInfoProps {
  data: TWeatherData;
  metric: string;
}

const WeatherInfo: React.FC<WeatherInfoProps> = ({ data, metric }) => {
  return (
    <CardContent className="text-center mb-4">
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
    </CardContent>
  );
};

interface SearchFormProps {
  cityName: string;
  setCityName: (cityName: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ cityName, setCityName, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2 mb-3">
      <div className="relative flex-grow">
        <Input
          placeholder="Enter city"
          value={cityName}
          onChange={e => setCityName(e.target.value)}
          className="p-3 pr-10 rounded-xl bg-gray-100 border-gray-800 text-gray-800 w-full"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900">
          <Search className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
};

interface MetricToggleProps {
  metric: 'metric' | 'imperial';
  handleMetricChange: () => void;
}

const MetricToggle: React.FC<MetricToggleProps> = ({ metric, handleMetricChange }) => {
  return (
    <Button
      onClick={handleMetricChange}
      className="p-3 rounded-xl bg-gray-100 hover:bg-gray-400 border-gray-800 text-gray-800 flex-1 mr-2 cursor-pointer">
      {metric === 'metric' ? '°C' : '°F'}
    </Button>
  );
};

export default withErrorBoundary(
  withSuspense(Popup, <SkeletonCard className="w-64 h-32" lineClassName="w-64" lines={2} />),
  <ErrorState error={new Error('An unexpected error occurred')} onRetry={() => {}} />,
);
