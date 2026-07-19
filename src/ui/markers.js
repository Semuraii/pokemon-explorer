import L from "leaflet";
import { getPokemon } from "../api/pokemon.js";
import { addPokemonToPokedex } from "./pokedex.js";
import { getPokemonForPlace } from "../engine/biomeEngine.js";


let markerGroup = null;

export async function createMarker(map, places) {
    if (!markerGroup) {
        markerGroup = L.layerGroup().addTo(map);
    }

    markerGroup.clearLayers();

    if (!places || !places.features) return;

    for (const place of places.features) {
       const { lat, lon } = place.properties;

       if (!lat || !lon) continue;

    const {
    name: placeName,
    address_line1,
    formatted
} = place.properties;

const name =
    place.properties.name ||
    place.properties.address_line1 ||
    place.properties.formatted ||
    "Ukjent lokasjon";
      

      const {
    pokemon: pokemonName
} = getPokemonForPlace(place);

       
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

setTimeout(() => {

    marker.closePopup();

}, 3000);

        });
    }
}
