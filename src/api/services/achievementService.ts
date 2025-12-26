import axios from "axios";

export const API_PREFIX = "/api/v1"
export const BASE_ADDRESS = "http://localhost:8080"

export const BASE_URL = BASE_ADDRESS + API_PREFIX;

const SERVICE_URL = `${BASE_URL}/users`;

export const achievementService = {
    getUserAchievements: async (lang: string) => {
        const headers = {
            withCredentials: true,
            headers: {
                'Accept-Language': lang,
            }
        }

        const response = await axios.get(`${SERVICE_URL}/achievements`, headers);
        return response.data;
    }
}