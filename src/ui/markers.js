import L from "leaflet";
import { pokemonMap } from "../data/pokemonMap.js";
import { getPokemon } from "../api/pokemon.js";

let markerGroup = null;
let caughtPokemon = 0;

export async function createMarker(map, places) {
    if (!markerGroup) {
        markerGroup = L.layerGroup().addTo(map);
    }

    markerGroup.clearLayers();

    if (!places || !places.features) return;

    for (const place of places.features) {
        const lat = place.properties.lat;
        const lon = place.properties.lon;

        console.log(JSON.stringify(place.properties, null, 2));

        const name =
    place.properties.name ||
    place.properties.address_line1 ||
    place.properties.formatted ||
    "Ukjent lokasjon";
      const categories = place.properties.categories || [];

      console.log(categories);


// Standard Pokémon
let pokemonName = "pikachu";

// Finn første kategori som finnes i pokemonMap
for (const category of categories) {

    console.log("Kategori:", category);

    if (pokemonMap[category]) {
        pokemonName = pokemonMap[category];
        break;
    }
}

// Hent Pokémon fra PokeAPI
const pokemon = await getPokemon(pokemonName);

const popupContent = `
<div style="text-align:center; min-width:180px;">

<h2>🎉 Pokémon Found!</h2>

<img src="${pokemon.sprites.front_default}" width="100">

<h3>${pokemon.name.toUpperCase()}</h3>

<p><strong>Location:</strong></p>
<p>${name}</p>

<p><strong>Type:</strong></p>
<p>${pokemon.types.map(type => type.type.name).join(", ")}</p>

<button class="catch-btn">
    Catch Pokémon
</button>

</div>
`;

     const pokemonIcon = L.icon({
    iconUrl: pokemon.sprites.front_default,
    iconSize: [60, 60],
    iconAnchor: [30, 60],
    popupAnchor: [0, -50]
});

const marker = L.marker([lat, lon], {
    icon: pokemonIcon
})
.addTo(markerGroup)
.bindPopup(popupContent);

marker.on("click", () => {

    caughtPokemon++;

    document.getElementById("caught-counter").textContent =
        `Caught Pokémon: ${caughtPokemon}`;

});
    }

}
