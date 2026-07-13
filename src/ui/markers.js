import L from "leaflet";
import { pokemonHabitats } from "../data/pokemonHabitats.js";
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

      // Find a matching Pokémon habitat
let habitatPokemon = null;

for (const category of categories) {

    if (pokemonHabitats[category]) {

        habitatPokemon = pokemonHabitats[category];

        break;

    }

}

      console.log(categories);

const locationKey = `${lat}${lon}`;

let hash = 0;

for (let i = 0; i < locationKey.length; i++) {
    hash += locationKey.charCodeAt(i);
}

pokemonName = habitatPokemon[
    hash % habitatPokemon.length
];


// Hent Pokémon fra PokeAPI
const pokemon = await getPokemon(pokemonName);

const popupContent = `
<div class="pokemon-popup">

<img
    src="${
        pokemon.sprites.other["official-artwork"].front_default ||
        pokemon.sprites.front_default
    }"
>

<h3>${pokemon.name.toUpperCase()}</h3>

<p>
📍 ${name}
</p>

<p>
⚡ ${pokemon.types
    .map(type => type.type.name)
    .join(", ")}
</p>

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
<div class="pokemon-popup">

    <img
    src="${
        pokemon.sprites.other["official-artwork"].front_default ||
        pokemon.sprites.front_default
    }"
>

    <h3>${pokemon.name.toUpperCase()}</h3>

    <p><strong>Location:</strong></p>
    <p>${name}</p>

    <p><strong>Type:</strong></p>
    <p>${pokemon.types.map(type => type.type.name).join(", ")}</p>

    <p style="color:green;font-weight:bold;">
        Added to your Pokédex!
    </p>

</div>
`);
    });
}
}
