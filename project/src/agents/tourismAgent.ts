import { getCoordinates } from '../services/geocoding';
import { WeatherAgent } from './weatherAgent';
import { PlacesAgent } from './placesAgent';

export interface TourismAgentResult {
  success: boolean;
  message: string;
  placeName?: string;
  weather?: string;
  places?: string[];
}

export class TourismAgent {
  private weatherAgent: WeatherAgent;
  private placesAgent: PlacesAgent;

  constructor() {
    this.weatherAgent = new WeatherAgent();
    this.placesAgent = new PlacesAgent();
  }

  async execute(userInput: string): Promise<TourismAgentResult> {
    const placeName = this.extractPlaceName(userInput);

    if (!placeName) {
      return {
        success: false,
        message: "I couldn't identify a place name in your input. Please specify a location."
      };
    }

    const coordinates = await getCoordinates(placeName);

    if (!coordinates) {
      return {
        success: false,
        message: `I don't know if the place "${placeName}" exists. Please check the spelling or try a different location.`
      };
    }

    const needsWeather = this.needsWeatherInfo(userInput);
    const needsPlaces = this.needsPlacesInfo(userInput);

    let weatherResult;
    let placesResult;
    let combinedMessage = '';

    if (needsWeather) {
      weatherResult = await this.weatherAgent.execute(coordinates.lat, coordinates.lon, placeName);
      if (weatherResult.success && weatherResult.data) {
        combinedMessage += weatherResult.data;
      }
    }

    if (needsPlaces) {
      placesResult = await this.placesAgent.execute(coordinates.lat, coordinates.lon, placeName);
      if (placesResult.success && placesResult.data) {
        if (combinedMessage) {
          combinedMessage += ' And these are the places you can go:\n' + placesResult.places?.join('\n');
        } else {
          combinedMessage = placesResult.data;
        }
      }
    }

    if (!needsWeather && !needsPlaces) {
      weatherResult = await this.weatherAgent.execute(coordinates.lat, coordinates.lon, placeName);
      placesResult = await this.placesAgent.execute(coordinates.lat, coordinates.lon, placeName);

      if (weatherResult.success && weatherResult.data) {
        combinedMessage = weatherResult.data;
      }

      if (placesResult.success && placesResult.data) {
        if (combinedMessage) {
          combinedMessage += ' And these are the places you can go:\n' + placesResult.places?.join('\n');
        } else {
          combinedMessage = placesResult.data;
        }
      }
    }

    return {
      success: true,
      message: combinedMessage,
      placeName,
      weather: weatherResult?.data,
      places: placesResult?.places
    };
  }

  private extractPlaceName(input: string): string | null {
    const patterns = [
      /going to (?:go to )?([^,?.!]+)/i,
      /visit (?:to )?([^,?.!]+)/i,
      /trip to ([^,?.!]+)/i,
      /travel to ([^,?.!]+)/i,
      /in ([^,?.!]+)/i
    ];

    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }

    return null;
  }

  private needsWeatherInfo(input: string): boolean {
    const weatherKeywords = ['weather', 'temperature', 'rain', 'climate', 'hot', 'cold', 'sunny'];
    return weatherKeywords.some(keyword => input.toLowerCase().includes(keyword));
  }

  private needsPlacesInfo(input: string): boolean {
    const placesKeywords = ['places', 'visit', 'attractions', 'tourist', 'see', 'plan', 'trip', 'go'];
    return placesKeywords.some(keyword => input.toLowerCase().includes(keyword));
  }
}
