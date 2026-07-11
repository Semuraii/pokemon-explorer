const caughtPokemon = new Set();

export function addPokemonToPokedex(pokemon) {

    // Prevent duplicates
    if (caughtPokemon.has(pokemon.name)) {
        return;
    }

    caughtPokemon.add(pokemon.name);

    const pokemonList = document.getElementById("pokemon-list");

    // Remove "No Pokémon caught yet."
    if (pokemonList.children.length === 1 &&
        pokemonList.textContent.includes("No Pokémon")) {

        pokemonList.innerHTML = "";
    }

    const card = document.createElement("div");

    card.className = "pokemon-card";

    card.innerHTML = `
        <img src="${pokemon.sprites.front_default}" width="60">

        <div>

            <h3>${pokemon.name.toUpperCase()}</h3>

            <p>${pokemon.types
                .map(type => type.type.name)
                .join(", ")}</p>

        </div>
    `;

    pokemonList.appendChild(card);

}