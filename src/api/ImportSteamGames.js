export async function ImportSteamGames(steamId) {
    let response = fetch(`/api/steam/user/${steamId}/games/titles`, {method: "GET"});
    let importSteamGames = [];

    response.then(async response => {
        const clonedResponse = response.clone();
        const jsonData = await clonedResponse.json();
        console.log(jsonData);

        fetch(`/api/igdb/steam-import`, {
            method: "POST",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify(jsonData)
        })
            .then(async response => {
                const clonedResponse = response.clone();
                const jsonData = await clonedResponse.json();
                console.log(jsonData);

                for (const game of jsonData) {
                    let importGame = {
                        id: game.id,
                        name: game.name,
                        cover: {
                            url: game?.cover?.url
                        }
                    };
                    importSteamGames.push(importGame);
                    //await addSteamGame(game.id, game.name, game.cover.url);
                }

            })
    })

    return importSteamGames;
}

export async function addImportedSteamGames(importedGames) {
    for (const game of importedGames) {
        await addSteamGame(game.id, game.name, game.cover.url);
    }
}

async function addSteamGame(igdbId, title, coverUrl) {
    await fetch("/api/game", {
        method: "POST",
        headers: {"Accept": "application/json", "Content-Type": "application/json"},
        body: JSON.stringify({
            "igdbId": igdbId,
            "title": title,
            "coverUrl": coverUrl
        })
    });
    localStorage.removeItem(window.location.pathname);
}