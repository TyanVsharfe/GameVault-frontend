import {apiClient} from "../client";

export interface ImportedSteamGame {
    id: number;
    name: string;
    cover: string;
    isChecked: boolean;
}

const GAME_ENDPOINTS = {
    IMPORT_BY_ID: (steamId: string) => `/steam-import/${steamId}`,
    ADD_BY_ID: (steamId: string) => `/steam-import/${steamId}`,
} as const;

export const steamGamesService = {
    importSteamGames: async (steamId: string) => {
        let importSteamGames = [];
        console.log("GET STEAM GAMES");

        const responseSteamImport = await apiClient.get(GAME_ENDPOINTS.IMPORT_BY_ID(steamId));

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
    },

    addImportedSteamGames: async (steamId: string, importedGames) => {
        const query = importedGames;
        console.log("IMPORT STEAM");

        const responseSteamImport = await apiClient.post(GAME_ENDPOINTS.ADD_BY_ID(steamId), query);
    }
}


