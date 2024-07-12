export async function checkEntity(id) {
    try {
        const response = await fetch(`/api/checkEntity/${id}`);

        if (response.ok) {
            const result = await response.json();
            console.log(result);
            return result;
        } else {
            console.error('Ошибка при проверке сущности:', response.status);
            return null;
        }
    } catch (error) {
        console.error('Произошла ошибка:', error);
        return null;
    }
}
