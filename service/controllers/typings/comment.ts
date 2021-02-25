enum CommentStatus {
    unPass = -1,
    pending,
    pass
}

export interface CodaComment {
    id: string;
    parentId: string;
    email: string;
    nickname: string;
    website?: string;
    content: string;
    status?: CommentStatus;
    notify?: boolean;
    postId: string;
    createdAt: string;
}
