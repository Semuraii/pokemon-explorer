import "leaflet/dist/leaflet.css";
import "./style.css";
import L from "leaflet";
import { getPokemon } from "./api/pokemon.js";

import { getPlaces, searchLocation } from "./api/geoapify.js";
import { createMarker } from "./ui/markers.js";

const map = L.map("map").setView([59.91, 10.75], 13);

// RETTET URL: Lagt til "tile." og "/" før klammeparentesene
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let currentCategory = "amenity";
document
    .querySelector('[data-category="amenity"]')
    ?.classList.add("active"); 

async function loadPlaces() {

console.log("Laster steder...");

  const center = map.getCenter();
  const data = await getPlaces(center.lat, center.lng, currentCategory);

console.log(data);

  createMarker(map, data);
}

// Henter nye steder automatisk når du drar kartet rundt!
map.on("moveend", () => {
  loadPlaces();
});

// Søkefunksjon
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

if (searchBtn && searchInput) {
  searchBtn.addEventListener("click", async () => {
    const query = searchInput.value;
    if (!query) return;

    const searchData = await searchLocation(query);
    
    if (searchData.features && searchData.features.length > 0) {
      const coordinates = searchData.features[0].geometry.coordinates;
      // Merk: Geoapify returnerer [lon, lat], men Leaflet bruker [lat, lon]
      map.setView([coordinates[1], coordinates[0]], 13);
    } else {
      alert("Fant ingen lokasjoner for: " + query);
    }
  });
}

const filterButtons = document.querySelectorAll(".filter-btn");

// Filterfunksjon
filterButtons.forEach(button => {

    button.addEventListener("click", async () => {

    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    currentCategory = button.dataset.category;

    await loadPlaces();

});

});

loadPlaces();

async function testPokemon() {
    try {
        const pokemon = await getPokemon("pikachu");
        console.log("Pikachu:", pokemon);
    } catch (error) {
        console.error(error);
    }
}

testPokemon();
