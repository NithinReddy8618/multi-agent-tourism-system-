import { getWeather } from '../services/weather';

export interface WeatherAgentResult {
  success: boolean;
  data?: string;
  error?: string;
}

export class WeatherAgent {
  async execute(lat: number, lon: number, placeName: string): Promise<WeatherAgentResult> {
    const weather = await getWeather(lat, lon);

    if (!weather) {
      return {
        success: false,
        error: 'Unable to fetch weather data'
      };
    }

    return {
      success: true,
      data: `In ${placeName} it's currently ${weather.temperature}°C with a ${weather.precipitation_probability}% chance of rain.`
    };
  }
}
