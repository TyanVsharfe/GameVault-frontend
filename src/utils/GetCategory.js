import {categoryIGDB} from "./Enums";

export function getCategory(number) {
    if (number < 0 || number > 14) {
        return 'Incorrect category';
    }

    for (const key in categoryIGDB) {
        if (categoryIGDB[key] === number) {
            return key;
        }
    }
}