import { biomeCategories } from "../data/biomeCategories.js";
import { biomes } from "../data/biomes.js";

const defaultPokemon = [
    "pidgey",
    "rattata",
    "weedle",
    "caterpie",
    "zubat"
];

export function getPokemonForPlace(place) {

    const categories = place.properties.categories || [];

    const locationName = (
    place.properties.name ||
    place.properties.formatted ||
    ""
).toLowerCase();

    const lat = place.properties.lat;
    const lon = place.properties.lon;

    const locationKey = `${lat}${lon}`;

    let hash = 0;

    for (const char of locationKey) {
        hash += char.charCodeAt(0);
    }

    const biomeScores = {};

    // ----- Name based biome boosts -----

if (
    locationName.includes("park") ||
    locationName.includes("garden") ||
    locationName.includes("forest") ||
    locationName.includes("botanical") ||
    locationName.includes("nature") ||
    locationName.includes("green")
 ) {

    biomeScores.forest =
        (biomeScores.forest || 0) + 4;

    biomeScores.fields =
        (biomeScores.fields || 0) + 2;

}

if (
    locationName.includes("beach") ||
    locationName.includes("harbor") ||
    locationName.includes("harbour") ||
    locationName.includes("dock") ||
    locationName.includes("marina") ||
    locationName.includes("port") ||
    locationName.includes("brygge") ||
    locationName.includes("kai") ||
    locationName.includes("pier") ||
    locationName.includes("fjord") ||
    locationName.includes("strand") ||
    locationName.includes("river") ||
    locationName.includes("lake")
) {

    biomeScores.water =
        (biomeScores.water || 0) + 5;

}

if (
    locationName.includes("museum") ||
    locationName.includes("castle") ||
    locationName.includes("church") ||
    locationName.includes("cathedral") ||
    locationName.includes("cemetery") ||
    locationName.includes("memorial") ||
    locationName.includes("fort") ||
    locationName.includes("fortress") ||
    locationName.includes("grave") ||
    locationName.includes("chapel") ||
    locationName.includes("ruin")
) {

    biomeScores.ghost =
        (biomeScores.ghost || 0) + 5;

}

if (
    locationName.includes("airport") ||
    locationName.includes("tower") ||
    locationName.includes("bridge") ||
    locationName.includes("lookout")
) {

    biomeScores.flying =
        (biomeScores.flying || 0) + 5;

}

if (
    locationName.includes("station") ||
    locationName.includes("factory") ||
    locationName.includes("warehouse") ||
    locationName.includes("terminal") ||
    locationName.includes("depot") ||
    locationName.includes("cargo")
) {

    biomeScores.industrial =
        (biomeScores.industrial || 0) + 5;

}

    for (const category of categories) {

        for (const key in biomeCategories) {

            if (category.startsWith(key)) {

              for (const biome of biomeCategories[key]) {

    biomeScores[biome] =
        (biomeScores[biome] || 0) + 1;

}

            }

        }

    }

    const biomeEntries = Object.entries(biomeScores);

const biome =
    biomeEntries.length > 0
        ? biomeEntries.sort((a, b) => {

            if (b[1] !== a[1]) {
                return b[1] - a[1];
            }

            return a[0].localeCompare(b[0]);

        })[0][0]
        : null;

const pokemonPool = [];

for (const [biomeName, score] of biomeEntries) {

    if (!biomes[biomeName]) continue;

    for (let i = 0; i < score; i++) {

        pokemonPool.push(
            ...biomes[biomeName]
        );

    }

}

    const pokemonList =
    pokemonPool.length > 0
        ? pokemonPool
        : defaultPokemon;

const pokemon =
    pokemonList[
        hash % pokemonList.length
    ];

    console.log("--------------------------------");
console.log("Location:", locationName);
console.log("Biome scores:", biomeScores);
console.log("Winning biome:", biome);
console.log("Chosen Pokémon:", pokemon);

    return {

        biome,

        pokemon

    };

}