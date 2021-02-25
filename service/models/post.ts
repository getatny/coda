import { Post } from '../database/models';

export default {
    findPost(id: string) {
        return Post.findOne({ where: { id } });
    },
};
