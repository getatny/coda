export type Comment = {
    id: string;
    parentId?: string;
    email: string;
    nickname: string;
    website?: string;
    content: string;
    status: number;
    notify: boolean;
    createdAt: string;
    author: boolean;
}
