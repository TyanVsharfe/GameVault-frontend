import axios from "axios";
import {addUserGame} from "./userGamesService";

const BASE_URL = 'http://localhost:8080/api/steam';
const STEAM_IMPORT_URL = 'http://localhost:8080/api/igdb/steam-import';

export interface ImportedSteamGame {
    id: number;
    name: string;
    cover: string;
    isChecked: boolean;
}

export async function importSteamGames(steamId: String) {
    const headers = {withCredentials: true};
    const response = await axios.get(`${BASE_URL}/user/${steamId}/games/titles`, headers);
    let importSteamGames = [];
    console.log("IMPORT STEAM");
    console.log(response);
    console.log(`/api/steam/user/${steamId}/games/titles`);

    const jsonData = await response.data;
    console.log(jsonData);

    const query = jsonData;

    const headers1 = {
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    };

    const responseSteamImport = await axios.post(`${STEAM_IMPORT_URL}`, query, headers1);

    const jsonData1 = await responseSteamImport.data;

    for (const game of jsonData1) {
        let importGame: { id: any; name: any; cover: any } = {
            id: game.id,
            name: game.name,
            cover: game?.cover?.url,
        };
        importSteamGames.push(importGame);
    }

    console.log(importSteamGames);
    return importSteamGames;
}

export async function addImportedSteamGames(importedGames) {
    for (const game of importedGames) {
        await addUserGame(game.id);
    }
}