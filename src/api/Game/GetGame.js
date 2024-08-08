import {getGameId} from "../../utils/GetGameId";

export async function GetGame() {
    return (await fetch(`/api/game/${getGameId()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })).json()
}