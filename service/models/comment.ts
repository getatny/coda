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
};
