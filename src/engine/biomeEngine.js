import { biomeCategories } from "../data/biomeCategories.js";

export function determineBiome(places) {

    const biomeScores = {};

    if (!places || !places.features) {
        return "urban";
    }

    for (const place of places.features) {

        const categories =
            place.properties.categories || [];

        for (const category of categories) {

            for (const key in biomeCategories) {

                if (category.startsWith(key)) {

                    const biomes =
                        biomeCategories[key];

                    biomes.forEach(biome => {

                        biomeScores[biome] =
                            (biomeScores[biome] || 0) + 1;

                    });

                }

            }

        }

    }

    let bestBiome = "urban";
    let highestScore = 0;

    for (const biome in biomeScores) {

        if (biomeScores[biome] > highestScore) {

            highestScore = biomeScores[biome];
            bestBiome = biome;

        }

    }

    console.log("Biome Scores:", biomeScores);
    console.log("Current Biome:", bestBiome);

    return bestBiome;

}