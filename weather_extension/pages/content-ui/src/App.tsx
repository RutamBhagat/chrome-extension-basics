import { TWeatherData, fetchOpenWeatherData } from '@extension/shared';
import { Thermometer, Wind, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@extension/ui/lib/components/ui';
import { cn } from '@extension/ui/lib/utils';
import { exampleThemeStorage } from '@extension/storage';
import { useStorage } from '@extension/shared';

export default function App() {
  const theme = useStorage(exampleThemeStorage);
  const [homeCityWeatherData, setHomeCityWeatherData] = useState<TWeatherData>();
  const [metric, setMetric] = useState<'metric' | 'imperial'>('metric');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    chrome.storage.sync.get(['homeCity', 'isVisible'], result => {
      setIsVisible(result.isVisible !== false); // Default to true if not set
      fetchOpenWeatherData(result.homeCity || 'Goa', metric).then(data => {
        setHomeCityWeatherData(data);
      });
    });
  }, [metric]);

  const handleMetricChange = () => {
    setMetric(prevMetric => (prevMetric === 'metric' ? 'imperial' : 'metric'));
  };

  const handleClose = () => {
    setIsVisible(false);
    chrome.storage.sync.set({ isVisible: false });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed bottom-0 right-0 w-80 p-4 z-50',
        theme === 'dark' ? 'bg-indigo-900 text-white' : 'bg-white text-gray-900',
      )}>
      <div className="flex items-center justify-between mb-4">
        <Button className="text-lg" onClick={handleMetricChange}>
          {metric === 'metric' ? '°C' : '°F'}
        </Button>
        <Button onClick={handleClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      {homeCityWeatherData ? <WeatherInfo data={homeCityWeatherData} metric={metric} /> : <div>Loading...</div>}
    </div>
  );
}

interface WeatherInfoProps {
  data: TWeatherData;
  metric: string;
}

const WeatherInfo: React.FC<WeatherInfoProps> = ({ data, metric }) => {
  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  return (
    <div className="text-center mb-4">
      <h2 className="text-3xl font-bold mb-2">{data.name}</h2>
      <div className="flex justify-center items-center mb-4">
        <img src={iconUrl} alt={data.weather[0].description} className="h-12 w-12 mr-2" />
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
};
