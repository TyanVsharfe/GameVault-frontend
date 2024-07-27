export async function ImportSteamGames(steamId) {
    let response = fetch(`/api/steam/user/${steamId}/games/titles`, {method: "GET"});

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
                    await addSteamGame(game.id, game.name, game.cover.url);
                }
            })
    })

    localStorage.removeItem(window.location.pathname);
    alert("Игры импортированы")
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