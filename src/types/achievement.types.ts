export interface Achievement {
    id: number;
    name: string;
    description: string;
    category: string;
    requiredCount: number;
    experiencePoints: number;
}

export interface UserAchievment {
    id: number;
    achievement: Achievement;
    achievedAt: string;
    currentProgress: number;
    completed: boolean;
}