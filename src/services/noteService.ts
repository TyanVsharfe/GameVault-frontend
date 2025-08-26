import axios from "axios";
import {apiRequest, BASE_URL} from "./authService";

export interface Note {
    id: number;
    title: string;
    content: string;
}

const SERVICE_URL = `${BASE_URL}/games/notes`;

export async function addNote(igdbId: string | undefined, title: string, content: string) {
    const headers = {withCredentials: true};
    const query = {
        "title": title,
        "content": content,
    };

    const response = await axios.post(`${SERVICE_URL}/${igdbId}`, query, headers);

    await apiRequest(response)

    return response.data;
}

export async function editNote(noteId: number, title: string | undefined,content: string | undefined) {
    const headers = {withCredentials: true};

    const query: Record<string, string> = {};
    if (title !== undefined) query.title = title;
    if (content !== undefined) query.content = content;

    const response = await axios.put(`${SERVICE_URL}/${noteId}`, query, headers);

    await apiRequest(response)

    return response.data;
}

export async function deleteNote(noteId: string | undefined) {
    const headers = {withCredentials: true};

    const response = await axios.delete(`${SERVICE_URL}/${noteId}`, headers);

    await apiRequest(response)

    return response.data;
}