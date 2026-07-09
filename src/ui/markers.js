import L from "leaflet";

export function createMarker(map, places) {
    places.features.forEach(place => {
        const lat = place.properties.lat;
        const lon = place.properties.lon;

        L.marker([lat, lon])
        .addTo(map)
        .bindPopup(place.properties.name);
    });
}