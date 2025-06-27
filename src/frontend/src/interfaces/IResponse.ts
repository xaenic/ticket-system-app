
export interface IResponse<T> {
    current_page: number;
    data: T[];
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
}

