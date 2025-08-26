import axios from "axios";
import {BASE_URL} from "./authService";

const SERVICE_URL = `${BASE_URL}/users`;

export interface UserStats  {
    username: string;
    totalGames: number;
    gamesByStatus: Record<string, number>;
    averageRating: number;
    totalNotes: number;
}

export const getUserStats = async (username: string) => {
    const headers = {withCredentials: true};

    const response = await axios.get(`${SERVICE_URL}/${username}/stats`, headers);
    return response.data;
};