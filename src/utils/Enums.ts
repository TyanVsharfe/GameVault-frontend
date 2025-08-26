export const enumStatus = {
    Completed: 0,
    Playing: 1,
    Planned: 2,
    Abandoned: 3
}

export const CategoryIGDB: Record<number, string> = {
    0: "type_main_game",
    1: "type_dlc_addon",
    2: "type_expansion",
    3: "type_bundle",
    4: "type_standalone_expansion",
    5: "type_mod",
    6: "type_episode",
    7: "type_season",
    8: "type_remake",
    9: "type_remaster",
    10: "type_expanded_game",
    11: "type_port",
    12: "type_fork",
    13: "type_pack",
    14: "type_update"
};

export function getCategoryName(categoryNumber: number): string {
    return CategoryIGDB[categoryNumber] ?? "Unknown Category";
}


export function getCategory(number) {
    if (number < 0 || number > 14) {
        return 'Incorrect category';
    }

    for (const key in CategoryIGDB) {
        if (CategoryIGDB[key] === number) {
            return key;
        }
    }
}

