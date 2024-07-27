export function editNote(noteId, content) {
    fetch(`/api/game/note/${noteId}`, {
        method: "PUT",
        headers: {"Accept": "application/json", "Content-Type": "application/json"},
        body: JSON.stringify({
            "content": content,
        })
    });
    localStorage.removeItem(window.location.pathname);
    alert("Заметка обновлена")
}