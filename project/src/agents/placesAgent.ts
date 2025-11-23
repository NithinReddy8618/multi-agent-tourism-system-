import { getTouristPlaces } from '../services/places';

export interface PlacesAgentResult {
  success: boolean;
  data?: string;
  places?: string[];
  error?: string;
}

export class PlacesAgent {
  async execute(lat: number, lon: number, placeName: string): Promise<PlacesAgentResult> {
    const places = await getTouristPlaces(lat, lon);

    if (places.length === 0) {
      return {
        success: false,
        error: 'No tourist attractions found'
      };
    }

    const placeNames = places.map(p => p.name);

    return {
      success: true,
      places: placeNames,
      data: `In ${placeName} these are the places you can go:\n${placeNames.join('\n')}`
    };
  }
}
