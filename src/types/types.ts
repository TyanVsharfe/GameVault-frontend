export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
}

export interface BaseEntity {
    createdAt: number;
    updatedAt: number;
}