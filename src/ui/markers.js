import L from "leaflet";
import { pokemonMap } from "../data/pokemonMap.js";
import { getPokemon } from "../api/pokemon.js";

let markerGroup = null;

function getPokemonTheme(categories) {
    // Sjekker om det er en restaurant eller kafé -> Charmander (Ild)
    if (categories.includes("catering.restaurant") || categories.includes("catering.cafe")) {
        return { 
            type: "Fire/Normal", 
            icon: "https://githubusercontent.com", 
            placeType: "Pokémon Café" 
        }; 
    }
    // Sjekker om det er en park eller natur -> Bulbasaur (Gress)
    if (categories.includes("leisure.park") || categories.includes("natural")) {
        return { 
            type: "Grass", 
            icon: "https://githubusercontent.com", 
            placeType: "Wild Area" 
        }; 
    }
    // Sjekker om det er et hotell eller overnatting -> Jigglypuff (Healing)
    if (categories.includes("tourism.hotel") || categories.includes("accommodation")) {
        return { 
            type: "Healing", 
            icon: "https://githubusercontent.com", 
            placeType: "Pokémon Center" 
        }; 
    }
    // Standard for alt annet -> Pikachu (Elektrisk/Normal)
    return { 
        type: "Normal", 
        icon: "https://githubusercontent.com", 
        placeType: "PokéStop" 
    }; 
}

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


