import { CloudRain, Thermometer, Wind } from 'lucide-react';

import { CardContent } from '../ui';
import { TWeatherData } from '@extension/shared';

export const WeatherInfo = ({ data, metric }: { data: TWeatherData | undefined; metric: string }) => (
  <CardContent className="text-center">
    {data ? (
      <>
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
      </>
    ) : null}
  </CardContent>
);
