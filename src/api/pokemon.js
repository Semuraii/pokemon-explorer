export async function getPokemon(name) {

    try {

        const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${name}`
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch Pokémon: ${name}`);
        }

        return await response.json();

    } catch (error) {
        return null;
    }

}