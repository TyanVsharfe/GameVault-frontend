import axios from "axios";
import {enumStatus} from "../../../tometracker-frontend/src/utils/Enums.ts";

const BASE_URL = 'http://localhost:8080/users';

export interface UserStats  {
    username: string;
    totalGames: number;
    gamesByStatus: Record<string, number>;
    averageRating: number;
    totalNotes: number;
}

export const getUserStats = async (username: string) => {
    const headers = {withCredentials: true};

    const response = await axios.get(`${BASE_URL}/${username}/stats`, headers);
    return response.data;
};