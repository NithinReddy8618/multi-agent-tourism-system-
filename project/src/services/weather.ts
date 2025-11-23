export interface WeatherData {
  temperature: number;
  precipitation_probability: number;
  weather_description: string;
}

export async function getWeather(lat: number, lon: number): Promise<WeatherData | null> {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation_probability&timezone=auto`
    );

    if (!response.ok) {
      throw new Error('Weather request failed');
    }

    const data = await response.json();

    return {
      temperature: Math.round(data.current.temperature_2m),
      precipitation_probability: data.current.precipitation_probability || 0,
      weather_description: `${Math.round(data.current.temperature_2m)}°C with a ${data.current.precipitation_probability || 0}% chance of rain`
    };
  } catch (error) {
    console.error('Weather error:', error);
    return null;
  }
}
