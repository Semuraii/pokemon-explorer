let common = 0;
let rare = 0;
let legendary = 0;

const caughtPokemon = new Set();

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

}