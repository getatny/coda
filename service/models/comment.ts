import { Op, Sequelize } from 'sequelize';

import { CodaComment } from '../database/models';

export default {
    getCommentsByPostId: ({
        postId, page, pageSize, email = null,
    }: {
        postId: string;
        page: number;
        pageSize: number;
        email?: string;
    }) => CodaComment.findAll({
        where: email ? {
            [Op.or]: [
                {
                    [Op.and]: [
                        { postId },
                        { status: 1 },
                    ],
                },
                {
                    [Op.and]: [
                        { postId },
                        { status: 0 },
                        { email },
                    ],
                },
            ],
        } : {
            [Op.and]: [
                { postId },
                { status: 1 },
            ],
        },
        limit: pageSize,
        offset: (page - 1) * pageSize,
        order: Sequelize.literal('createdAt DESC'),
    }),

    getComments: (options: any) => CodaComment.findAndCountAll({
        order: Sequelize.literal('createdAt DESC'),
        ...options,
    }),

    countComments: (where) => CodaComment.count({ where, paranoid: true }),

    createComment({
        postId,
        commentContent,
        email,
        nickname,
        website = null,
        parentId = null,
        notify,
        status = 0,
    }: {
        postId: string;
        commentContent: string;
        email: string;
        nickname: string;
        website?: string;
        parentId?: string;
        notify: boolean;
        status?: -1 | 0 | 1
    }) {
        return CodaComment.create({
            postId, email, nickname, website, parentId, content: commentContent, notify, status,
        });
    },
};
