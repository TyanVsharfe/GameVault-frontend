export const API_CONFIG = {
    BASE_ADDRESS: import.meta.env.VITE_API_URL || "http://localhost:8080",
    API_PREFIX: "/api/v1",
    TIMEOUT: 10000,
} as const;

export const getBaseUrl = () => `${API_CONFIG.BASE_ADDRESS}${API_CONFIG.API_PREFIX}`;