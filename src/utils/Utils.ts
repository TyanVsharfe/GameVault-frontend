export function formatDate(dateString: string | undefined): string | undefined {
    if (dateString === undefined) {
        return undefined;
    }

    const parts = dateString.split('-');

    if (parts.length === 1) {
        return `${parts[0]}`;
    }

    if (parts.length === 2) {
        return `${parts[1]}.${parts[0]}`;
    }

    if (parts.length === 3) {
        const [year, month, day] = parts;
        return `${day}.${month}.${year}`;
    }

    return undefined;
}

export const getScoreClass = (score: number): string => {
    if (score >= 70) return "review-score high";
    if (score >= 40) return "review-score medium";
    return "review-score low";
};

export const getRatingColor = (score: number): string => {
    if (score < 40) return 'rgba(229,57,53,0.75)';
    if (score < 50) return 'rgba(251,140,0,0.75)';
    if (score < 70) return 'rgba(253,216,53,0.75)';
    return 'rgba(45, 139, 58, 0.75)';
};

export const statusColors: Record<string, string> = {
    "Planned": "rgba(139,92,246,0.5)",
    "Playing": "rgba(251,146,60,0.5)",
    "Completed": "rgba(45, 139, 58, 0.75)",
    "Abandoned": "rgba(229,57,53,0.5)",
    "None": "rgba(61,180,230,0.5)"
};


