export interface TouristPlace {
  name: string;
  type: string;
}

export async function getTouristPlaces(lat: number, lon: number, radius: number = 10000): Promise<TouristPlace[]> {
  try {
    const overpassQuery = `
      [out:json][timeout:25];
      (
        node["tourism"="attraction"](around:${radius},${lat},${lon});
        node["tourism"="museum"](around:${radius},${lat},${lon});
        node["historic"](around:${radius},${lat},${lon});
        node["leisure"="park"](around:${radius},${lat},${lon});
        way["tourism"="attraction"](around:${radius},${lat},${lon});
        way["tourism"="museum"](around:${radius},${lat},${lon});
        way["historic"](around:${radius},${lat},${lon});
        way["leisure"="park"](around:${radius},${lat},${lon});
      );
      out center 5;
    `;

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `data=${encodeURIComponent(overpassQuery)}`
    });

    if (!response.ok) {
      throw new Error('Places request failed');
    }

    const data = await response.json();

    const places: TouristPlace[] = data.elements
      .filter((element: any) => element.tags && element.tags.name)
      .map((element: any) => ({
        name: element.tags.name,
        type: element.tags.tourism || element.tags.historic || element.tags.leisure || 'attraction'
      }))
      .slice(0, 5);

    return places;
  } catch (error) {
    console.error('Places error:', error);
    return [];
  }
}
