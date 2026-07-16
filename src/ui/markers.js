import L from "leaflet";
import { biomes } from "../data/biomes.js";
import { biomeCategories } from "../data/biomeCategories.js";
import { getPokemon } from "../api/pokemon.js";
import { addPokemonToPokedex } from "./pokedex.js";


let markerGroup = null;

 // Default Pokémon if no habitat matches
        const defaultPokemon = [
            "pidgey",
            "rattata",
            "caterpie",
            "weedle",
            "zubat"
        ];

export async function createMarker(map, places) {
    if (!markerGroup) {
        markerGroup = L.layerGroup().addTo(map);
    }

    markerGroup.clearLayers();

    if (!places || !places.features) return;

    for (const place of places.features) {
        const lat = place.properties.lat;
        const lon = place.properties.lon;

        const name =
    place.properties.name ||
    place.properties.address_line1 ||
    place.properties.formatted ||
    "Ukjent lokasjon";
      const categories = place.properties.categories || [];

      // Create a unique number for this location
const locationKey = `${lat}${lon}`;

let hash = 0;

for (let i = 0; i < locationKey.length; i++) {
    hash += locationKey.charCodeAt(i);
}

const possibleBiomes = [];

for (const category of categories) {

    for (const key in biomeCategories) {

        if (category.startsWith(key)) {

            possibleBiomes.push(
                ...biomeCategories[key]
            );

        }

    }

}

const biome =
    possibleBiomes.length > 0
        ? possibleBiomes[
            hash % possibleBiomes.length
        ]
        : null;
       
        const availablePokemon =
            biome && biomes[biome]
                ? biomes[biome]
                : defaultPokemon;

        // Always get the same Pokémon for the same location
        const pokemonName =
            availablePokemon[hash % availablePokemon.length];

       // Hent Pokémon fra PokeAPI
        const pokemon = await getPokemon(pokemonName);

if (!pokemon) continue;

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
            iconUrl:
    pokemon.sprites.front_default ||
    pokemon.sprites.other["official-artwork"].front_default,
            iconSize: [55, 55],
            iconAnchor: [27, 55],
            popupAnchor: [0, -45]
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
