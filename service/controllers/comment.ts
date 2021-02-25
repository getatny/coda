import db from '../models';
import { errorResolver } from './resolver';

export default {
    getComments: async (ctx, next) => {
        const {
            key, page = 1, pageSize = 15, status = -2,
        } = ctx.params;
        const { email = null } = ctx.request.query;

        await errorResolver(async () => {
            const post = key === 'all' ? 'all' : await db.findPost(key);

            if (post) {
                if (post === 'all') {
                    const options = {
                        limit: parseInt(pageSize, 10),
                        offset: (parseInt(page, 10) - 1) * parseInt(pageSize, 10),
                        ...parseInt(status, 10) !== -2 ? {
                            where: {
                                status: parseInt(status, 10),
                            },
                        } : {},
                    };
                    const { count, rows: comments } = await db.getComments(options);

                    ctx.send({
                        comments,
                        count,
                    });
                } else {
                    const comments = await db.getCommentsByPostId({
                        postId: post.id,
                        page: parseInt(page, 10),
                        pageSize: parseInt(pageSize, 10),
                        email,
                    });
                    const count = await db.countComments({ postId: post.id, status: 1 });

                    ctx.send({
                        comments,
                        count,
                    });
                }
            } else {
                ctx.send({
                    comments: [],
                    count: 0,
                });
            }
        }, ctx);

        return next();
    },
};
