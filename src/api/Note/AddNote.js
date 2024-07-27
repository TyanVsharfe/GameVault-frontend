import {getGameId} from "../../utils/GetGameId";

export function addNote(content) {
    fetch(`/api/game/note`, {
        method: "POST",
        headers: {"Accept": "application/json", "Content-Type": "application/json"},
        body: JSON.stringify({
            "igdbId": getGameId(),
            "content": content,
        })
    });
    localStorage.removeItem(window.location.pathname);
    alert("Заметка добавлена")
}