const API_KEY = import.meta.env.VITE_GEOAPIFY_KEY;

async function fetchCategory(lat, lon, categories) {

   const response = await fetch(
    `https://api.geoapify.com/v2/places?` +
    `categories=${categories}` +
    `&filter=circle:${lon},${lat},1000` +
    `&limit=20` +
    `&apiKey=${API_KEY}`
);

    if (!response.ok) {
        throw new Error(`Failed to fetch ${categories}`);
    }

    return response.json();

}

export async function getPlaces(lat, lon) {

    try {

        const [
    natural,
    leisure,
    accommodation,
    commercial
] = await Promise.all([

    fetchCategory(lat, lon, "natural"),

    fetchCategory(lat, lon, "leisure"),

    fetchCategory(lat, lon, "accommodation"),

    fetchCategory(lat, lon, "commercial")

]);

return {

    features: [

        ...natural.features,
        ...leisure.features,
        ...accommodation.features,
        ...commercial.features

    ]

};

    } catch (error) {

        console.error("Geoapify Places API error:", error);

        return {
            features: []
        };

    }

}

export async function searchLocation(query) {

    try {

        const response = await fetch(
            `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(query)}&apiKey=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error("Failed to search for location.");
        }

        return response.json();

    } catch (error) {

        console.error("Geoapify Search API error:", error);

        return {
            features: []
        };

    }

}