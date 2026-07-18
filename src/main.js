import "leaflet/dist/leaflet.css";
import "./style.css";
import L from "leaflet";

import { getPlaces, searchLocation } from "./api/geoapify.js";
import { createMarker } from "./ui/markers.js";
import { loadPokedex } from "./ui/pokedex.js";

const map = L.map("map").setView([59.91, 10.75], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

async function loadPlaces() {

  const center = map.getCenter();
  const data = await getPlaces(
    center.lat,
    center.lng
);

  createMarker(map, data);
}

map.on("dragend", loadPlaces);

// Search
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

if (searchBtn && searchInput) {

    searchBtn.addEventListener("click", async () => {

        const query = searchInput.value;

        if (!query) return;

        const searchData = await searchLocation(query);

        if (searchData.features && searchData.features.length > 0) {

            const coordinates = searchData.features[0].geometry.coordinates;

            map.setView([coordinates[1], coordinates[0]], 13);

        } else {

            alert("Fant ingen lokasjoner for: " + query);

        }

    });

    searchInput.addEventListener("keydown", (event) => {

        if (event.key === "Enter") {

            searchBtn.click();

        }

    });

}

await loadPokedex();
loadPlaces();

const pokedex = document.querySelector(".pokedex");
const toggle = document.getElementById("pokedex-toggle");

toggle.addEventListener("click", () => {
    pokedex.classList.toggle("open");
});

