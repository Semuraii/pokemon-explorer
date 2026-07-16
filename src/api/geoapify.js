const API_KEY = import.meta.env.VITE_GEOAPIFY_KEY;

export async function getPlaces(lat, lon) {

    try {

        const categories = [
            "catering",
            "commercial",
            "accommodation",
            "leisure",
            "tourism",
            "natural"
        ].join(",");

        const response = await fetch(
            `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${lon},${lat},1000&limit=50&apiKey=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch nearby places.");
        }

        return await response.json();

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

        return await response.json();

    } catch (error) {

        console.error("Geoapify Search API error:", error);

        return {
            features: []
        };

    }

}