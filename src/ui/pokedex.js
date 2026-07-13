import { getPokemon } from "../api/pokemon.js";
const caughtPokemon = new Set();
const TOTAL_POKEMON = 151;

export function addPokemonToPokedex(pokemon) {

    // Prevent duplicates
    if (caughtPokemon.has(pokemon.name)) {
        return;
    }

    caughtPokemon.add(pokemon.name);

savePokedex();

    const collection = document.getElementById("pokemon-collection");

    const sprite = document.createElement("div");
    
    sprite.className = "collection-pokemon";
    
    sprite.innerHTML = `
<img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
`;

    sprite.addEventListener("click", () => {
        updatePokemonDisplay(pokemon);
    });

    collection.appendChild(sprite);

    updatePokemonDisplay(pokemon);

    updateProgress();

}

function savePokedex() {

    localStorage.setItem(
        "caughtPokemon",
        JSON.stringify([...caughtPokemon])
    );

}

function updatePokemonDisplay(pokemon) {

    const pokemonDisplay = document.getElementById("pokemon-display");

    pokemonDisplay.innerHTML = `
<div class="pokemon-card">

    <img src="${pokemon.sprites.other["official-artwork"].front_default}">

    <h2>${pokemon.name.toUpperCase()}</h2>

    <p class="pokemon-number">
        #${pokemon.id.toString().padStart(3, "0")}
    </p>

    <p>
        ${pokemon.types
            .map(type => type.type.name)
            .join(" • ")}
    </p>

    <hr>

    <p><strong>Height:</strong> ${pokemon.height / 10} m</p>

    <p><strong>Weight:</strong> ${pokemon.weight / 10} kg</p>

</div>
`;
}

function updateProgress() {

    const caught = caughtPokemon.size;

    document.getElementById("caught-counter").textContent =
        `Caught Pokémon: ${caught} / ${TOTAL_POKEMON}`;

    const percent = (caught / TOTAL_POKEMON) * 100;

    document.getElementById("progress-fill").style.width = `${percent}%`;

    document.getElementById("progress-percent").textContent =
        `${Math.round(percent)}%`;

}

export async function loadPokedex() {

    const savedPokemon = JSON.parse(
        localStorage.getItem("caughtPokemon")
    ) || [];

    for (const name of savedPokemon) {

        const pokemon = await getPokemon(name);

        addPokemonToPokedex(pokemon);

    }

}