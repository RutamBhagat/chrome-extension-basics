import { TWeatherData } from '../types/t_weather_data';
import { apiCall } from './api';

export async function fetchOpenWeatherData(city: string, units: string = 'metric'): Promise<TWeatherData> {
  // there is an issue with turbo repo .env vars
  // @ts-ignore
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=f4099e09b18444892e06cc88da1274f3`;

  try {
    const data = await apiCall<TWeatherData>(url);
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}
