const caughtPokemon = new Set();
const TOTAL_POKEMON = 151;

export function addPokemonToPokedex(pokemon) {

    // Prevent duplicates
    if (caughtPokemon.has(pokemon.name)) {
        return;
    }

    caughtPokemon.add(pokemon.name);

    const pokemonDisplay = document.getElementById("pokemon-display");

pokemonDisplay.innerHTML = `
<div class="pokemon-card">

    <img src="${pokemon.sprites.other["official-artwork"].front_default}">

    <h2>${pokemon.name.toUpperCase()}</h2>

    <p class="pokemon-number">

#${pokemon.id.toString().padStart(3,"0")}

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

pokemonDisplay.innerHTML = `
<div class="pokemon-card">

    <img src="${pokemon.sprites.other["official-artwork"].front_default}">

    <h2>${pokemon.name.toUpperCase()}</h2>

    <p class="pokemon-number">
#${pokemon.id.toString().padStart(3,"0")}
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

const caught = caughtPokemon.size;

document.getElementById("caught-counter").textContent =
    `Caught Pokémon: ${caught} / ${TOTAL_POKEMON}`;

const percent = (caught / TOTAL_POKEMON) * 100;

document.getElementById("progress-fill").style.width = `${percent}%`;

document.getElementById("progress-percent").textContent =
    `${Math.round(percent)}%`;

}