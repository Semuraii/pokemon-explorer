const API_KEY = import.meta.env.VITE_GEOAPIFY_KEY;

export async function getPlaces(lat, lon) {

    const categories = [
        "catering.restaurant"
    ].join(",");

    const response = await fetch(
        `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${lon},${lat},1000&limit=50&apiKey=${API_KEY}`
    );

    return await response.json();
}

export async function searchLocation(query) {

    const response = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(query)}&apiKey=${API_KEY}`
    );

    return await response.json();
}