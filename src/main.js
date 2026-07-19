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

const pokedex = document.getElementById("pokedex");
const toggleBtn = document.getElementById("pokedex-toggle");
const closeBtn = document.getElementById("close-pokedex");
console.log("Close button:", closeBtn);
const overlay = document.getElementById("overlay");

function openPokedex() {
    pokedex.classList.add("open");
    overlay.classList.add("show");
    toggleBtn.style.display = "none";

    setTimeout(() => {
        map.invalidateSize();
    }, 300);
}

function closePokedex() {
    pokedex.classList.remove("open");
    overlay.classList.remove("show");
    toggleBtn.style.display = "block";

    setTimeout(() => {
        map.invalidateSize();
    }, 300);
}

if (toggleBtn) {
    toggleBtn.addEventListener("click", openPokedex);
}

if (closeBtn) {
    closeBtn.addEventListener("click", closePokedex);
}

if (overlay) {
    overlay.addEventListener("click", closePokedex);
}

try {

    await loadPokedex();

}
catch(error) {

    console.error(
        "Failed loading Pokédex:",
        error
    );

}


try {

    loadPlaces();

}
catch(error) {

    console.error(
        "Failed loading map places:",
        error
    );

}



