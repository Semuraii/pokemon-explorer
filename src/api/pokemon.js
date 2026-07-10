export async function getPokemon(name) {
    const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${name}`
    );

    if (!response.ok) {
        throw new Error("Kunne ikke hente Pokémon.");
    }

    return await response.json();
}