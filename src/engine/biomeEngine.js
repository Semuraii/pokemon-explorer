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

    const lat = place.properties.lat;
    const lon = place.properties.lon;

    const locationKey = `${lat}${lon}`;

    let hash = 0;

    for (const char of locationKey) {
        hash += char.charCodeAt(0);
    }

    const biomeScores = {};

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
        ? biomeList.sort((a, b) => {

            if (b[1] !== a[1]) {
                return b[1] - a[1];
            }

            return a[0].localeCompare(b[0]);

        })[0][0]
        : null;

    const pokemonPool = [];

for (const [biomeName] of biomeList) {

    if (biomes[biomeName]) {

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

    return {

        biome,

        pokemon

    };

}