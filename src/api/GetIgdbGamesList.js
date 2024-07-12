export async function getIdgbGamesList(gameName) {
    try {
        const response = await fetch('http://localhost:8080/api/igdb/games', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: gameName
        });
        console.log(response);
        return await response.json();
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
    }
}
