import L from "leaflet";
import { pokemonMap } from "../data/pokemonMap.js";
import { getPokemon } from "../api/pokemon.js";

let markerGroup = null;

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
<div style="text-align:center">

<h3>${name}</h3>

<h4>${pokemon.name.toUpperCase()}</h4>

<img src="${pokemon.sprites.front_default}" width="80">

<p>
Type:
${pokemon.types.map(type => type.type.name).join(", ")}
</p>

</div>
`;

     const pokemonIcon = L.icon({
    iconUrl: pokemon.sprites.front_default,
    iconSize: [60, 60],
    iconAnchor: [30, 60],
    popupAnchor: [0, -50]
});

L.marker([lat, lon], {
    icon: pokemonIcon
})
    .addTo(markerGroup)
    .bindPopup(popupContent);
    };
}


