const API_KEY = import.meta.env.VITE_GEOAPIFY_KEY;
export async function getPlaces(lat, lon) {
    const response = await fetch(
        `https://api.geoapify.com/v2/places?categories=amenity&filter=circle:${lon},${lat},1000&limit=10&apiKey=${API_KEY}`
    );
    const data = await response.json();
    return data;
}

export async function searchLocation(lat, lon) {
    const data = await getPlaces(lat, lon);
    return data;
}