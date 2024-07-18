import {getGameId} from "../utils/GetGameId";

export function addRating(graphics, story, gameplay) {
    let rating = parseFloat(getRating(graphics, story, gameplay))
    fetch(`/api/game/${getGameId()}`, {
        method: "PUT",
        headers: {"Accept": "application/json", "Content-Type": "application/json"},
        body: JSON.stringify({
            "userRating": rating,
        })
    });
    localStorage.removeItem(window.location.pathname);
    alert("Оценка обновлена")
    return rating;
}

function getRating(graphics, story, gameplay) {
    return graphics * 2 + story * 3.5 + gameplay * 4.5
}