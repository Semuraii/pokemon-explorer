import "./style.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { getPlaces } from "./api/geoapify.js";
import { createMarker } from "./ui/markers.js";

console.log("JS kjører");
console.log(import.meta.env.VITE_GEOAPIFY_KEY);

const map = L.map("map").setView([59.91, 10.75], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

async function loadPlaces() {
  const data = await getPlaces(
    59.9139,
    10.7522
  );

  console.log(data);

  createMarker(map, data);
}

loadPlaces();

