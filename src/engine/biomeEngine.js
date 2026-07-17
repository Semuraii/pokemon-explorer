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
        possibleBiomes.length
            ? possibleBiomes[
                hash % possibleBiomes.length
              ]
            : null;

    const pokemonList =
        biome && biomes[biome]
            ? biomes[biome]
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