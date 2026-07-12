import L from "leaflet";
import { pokemonList } from "../data/pokemonList.js";
import { getPokemon } from "../api/pokemon.js";
import { addPokemonToPokedex } from "./pokedex.js";

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


// Create a unique number based on the coordinates
const locationKey = `${lat}${lon}`;

// Convert the string into a number
let hash = 0;

for (let i = 0; i < locationKey.length; i++) {
    hash += locationKey.charCodeAt(i);
}

// Always pick the same Pokémon for this location
const pokemonName = pokemonList[hash % pokemonList.length];

// Hent Pokémon fra PokeAPI
const pokemon = await getPokemon(pokemonName);

const popupContent = `
<div style="text-align:center; min-width:180px;">

<h2>🎉 Pokémon Found!</h2>

<img
    src="${
        pokemon.sprites.other["official-artwork"].front_default ||
        pokemon.sprites.front_default
    }"
    width="140"
>

<h3>${pokemon.name.toUpperCase()}</h3>

<p><strong>Location:</strong></p>
<p>${name}</p>

<p><strong>Type:</strong></p>
<p>${pokemon.types.map(type => type.type.name).join(", ")}</p>

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

marker.on("popupopen", () => {

    // Prevent catching the same Pokémon twice
    if (marker.caught) return;

    marker.caught = true;

    caughtPokemon++;

    document.getElementById("caught-counter").textContent =
        `Caught Pokémon: ${caughtPokemon}`;

    addPokemonToPokedex(pokemon);

    marker.setPopupContent(`
<div style="text-align:center; min-width:180px;">

    <h2>✅ Pokémon Caught!</h2>

    <img
    src="${
        pokemon.sprites.other["official-artwork"].front_default ||
        pokemon.sprites.front_default
    }"
    width="140"
>

    <h3>${pokemon.name.toUpperCase()}</h3>

    <p><strong>Location:</strong></p>
    <p>${name}</p>

    <p><strong>Type:</strong></p>
    <p>${pokemon.types.map(type => type.type.name).join(", ")}</p>

    <p><strong>Rarity:</strong></p>
    <p>${rarity}</p>

    <p style="color:green;font-weight:bold;">
        Added to your Pokédex!
    </p>

</div>
`);
    });
}
}
