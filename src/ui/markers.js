import L from "leaflet";

let markerGroup = null;

function getPokemonTheme(categories) {
    if (categories.includes("catering.restaurant") || categories.includes("catering.cafe")) {
        return { type: "Fire/Normal", icon: "https://githubusercontent.com", placeType: "Pokémon Café" }; 
    }
    if (categories.includes("leisure.park") || categories.includes("natural")) {
        return { type: "Grass", icon: "https://githubusercontent.com", placeType: "Wild Area" }; 
    }
    if (categories.includes("tourism.hotel") || categories.includes("accommodation")) {
        return { type: "Healing", icon: "https://githubusercontent.com", placeType: "Pokémon Center" }; 
    }
    return { type: "Normal", icon: "https://githubusercontent.com", placeType: "PokéStop" }; 
}

export function createMarker(map, places) {
    if (!markerGroup) {
        markerGroup = L.layerGroup().addTo(map);
    }

    markerGroup.clearLayers();

    if (!places || !places.features) return;

    places.features.forEach(place => {
        const lat = place.properties.lat;
        const lon = place.properties.lon;
        const name = place.properties.name || "Ukjent lokasjon";
        const categories = place.properties.categories || [];

        const theme = getPokemonTheme(categories);

        const pokemonIcon = L.icon({
            iconUrl: theme.icon,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40]
        });

        const popupContent = `
            <div style="text-align: center;">
                <h3>${name}</h3>
                <p><b>Type:</b> ${theme.placeType}</p>
                <p><b>Element:</b> ${theme.type}</p>
                <img src="${theme.icon}" width="50" />
            </div>
        `;

        L.marker([lat, lon], { icon: pokemonIcon })
         .addTo(markerGroup)
         .bindPopup(popupContent);
    });
}

