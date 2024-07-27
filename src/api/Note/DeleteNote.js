export function deleteNote(noteId) {
    fetch(`/api/game/note/${noteId}`, {
        method: "DELETE"
    });
    localStorage.removeItem(window.location.pathname);
    alert("Заметка удалена")
}