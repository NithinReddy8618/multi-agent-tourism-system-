Inkle Multi-Agent Tourism Planner

A simple multi-agent AI system that helps users plan trips by getting real-time weather, geocoding, and tourist attractions for any city.

Agents

Parent Tourism Agent
Understands queries and coordinates child agents.

Geocoding Agent
Converts place names to coordinates using Nominatim API.

Weather Agent
Fetches live temperature and rain chances using Open-Meteo API.

Places Agent
Suggests up to 5 attractions using Overpass API (OpenStreetMap).

Error Handling

If the place cannot be found, returns:
"I don't know whether this place exists."

Examples

Input:
“I am going to Bangalore, what about the temperature?”
Output:
“In Bangalore, it's currently 24°C with a 35% chance of rain.”

Input:
“Plan my trip to Bangalore.”
Output:
“Here are some places you can visit: Lalbagh, Cubbon Park, Bangalore Palace, Bannerghatta National Park, Jawaharlal Nehru Planetarium.”

Final link for the project: https://multi-agent-tourism-207v.bolt.host
