import {enUS, ru} from "date-fns/locale";
import {formatDistanceToNow} from "date-fns";

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

function getLocale(language: string) {
    if (language.startsWith("ru")) return ru;
    if (language.startsWith("en")) return enUS;
    return enUS;
}

export function formatRelative(updatedAt: string | number | Date, language: string) {
    return formatDistanceToNow(new Date(updatedAt), {
        addSuffix: true, // "назад"
        locale: getLocale(language),
    });
}

export const getScoreClass = (score: number): string => {
    if (score >= 70) return "review-score high";
    if (score >= 40) return "review-score medium";
    return "review-score low";
};

export const getRatingColor = (score: number | undefined, opacity: number | undefined): string => {
    if (opacity === undefined) opacity = 0.75;
    if (score == undefined) return `rgba(61,180,230, ${opacity})`
    if (score < 40) return `rgba(229,57,53, ${opacity})`;
    if (score < 50) return `rgba(209,129,5, ${opacity})`;
    if (score < 70) return `rgba(225,189,22, ${opacity})`;
    return `rgba(45, 139, 58, ${opacity})`;
};

export const statusColors: Record<string, string> = {
    "planned": "rgba(139,92,246,0.5)",
    "playing": "rgba(251,146,60,0.5)",
    "completed": "rgba(45, 139, 58, 0.75)",
    "abandoned": "rgba(229,57,53,0.5)",
    "none": "rgba(61,180,230,0.5)"
};

export const statusColorsHard: Record<string, string> = {
    "planned": "rgba(139,92,246,1)",
    "playing": "rgba(251,146,60,1)",
    "completed": "rgba(45, 139, 58, 1)",
    "abandoned": "rgba(229,57,53,1)",
    "none": "rgba(61,180,230,1)"
};


