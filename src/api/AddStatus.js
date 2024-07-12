import {getGameId} from "../utils/GetGameId";

export async function addStatus(status) {
    await fetch(`/api/game/${getGameId()}`, {
        method: "PUT",
        headers: {"Accept": "application/json", "Content-Type": "application/json"},
        body: JSON.stringify({
            "status": parseInt(status),
        })
    });
    localStorage.removeItem(window.location.pathname);
    alert("Статус обновлен")
}