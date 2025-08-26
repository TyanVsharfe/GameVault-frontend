import axios from "axios";
import {addUserGame} from "./userGamesService";
import {BASE_URL} from "./authService";

const SERVICE_URL = `${BASE_URL}/steam`;
const STEAM_IMPORT_URL = `${BASE_URL}/steam-import`;

export interface ImportedSteamGame {
    id: number;
    name: string;
    cover: string;
    isChecked: boolean;
}

export async function importSteamGames(steamId: String) {
    const headers = {withCredentials: true};
    let importSteamGames = [];
    console.log("GET STEAM GAMES");

    const responseSteamImport = await axios.get(`${STEAM_IMPORT_URL}/${steamId}`, headers);

    const jsonData = await responseSteamImport.data;

    for (const game of jsonData) {
        let importGame: { id: any; name: any; cover: any } = {
            id: game.id,
            name: game.name,
            cover: game?.cover?.url,
        };
        importSteamGames.push(importGame);
    }
    importSteamGames.sort((a, b) => a.name.localeCompare(b.name));
    console.log(importSteamGames);
    return importSteamGames;
}

export async function addImportedSteamGames(steamId: String, importedGames) {
    const headers = {withCredentials: true};
    const query = importedGames;
    console.log("IMPORT STEAM");

    const responseSteamImport = await axios.post(`${STEAM_IMPORT_URL}/${steamId}`, query, headers);
}