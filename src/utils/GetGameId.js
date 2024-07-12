export function getGameId() {
    // Получаем текущий путь страницы
    let currentPath = window.location.pathname;
    // Разбиваем путь на части по слешу '/'
    let pathParts = currentPath.split('/');
    // Получаем последний элемент массива (последний параметр в пути)
    return pathParts[pathParts.length - 1];
}