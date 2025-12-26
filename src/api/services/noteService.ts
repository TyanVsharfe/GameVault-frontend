import { apiClient } from "../client";

export interface Note {
    id: number;
    title: string;
    content: string;
}

const GAME_ENDPOINTS = {
    ADD: (igdbId: string) => `/games/${igdbId}/notes`,
    EDIT: (noteId: string) => `/games/notes/${noteId}`,
    DELETE: (noteId: string) => `/games/notes/${noteId}`,
} as const;

export const noteService = {
    addNote: async (igdbId: string | undefined, title: string, content: string) => {
        const query = {
            "title": title,
            "content": content,
        };

        const response = await apiClient.post(GAME_ENDPOINTS.ADD(igdbId ?? ""), query);

        //await apiRequest(response)

        return response.data;
    },

    editNote: async (noteId: string, title: string | undefined,content: string | undefined) => {

        const query: Record<string, string> = {};
        if (title !== undefined) query.title = title;
        if (content !== undefined) query.content = content;

        const response = await apiClient.put(GAME_ENDPOINTS.EDIT(noteId), query);

        //await apiRequest(response)

        return response.data;
    },

    deleteNote: async (noteId: string | undefined) => {
        const headers = {withCredentials: true};

        const response = await apiClient.delete(GAME_ENDPOINTS.DELETE(noteId ?? ""), headers);

        //await apiRequest(response)

        return response.data;
    }
}