import { Post } from '../database/models';

export default {
    findPost(id: string) {
        return Post.findOne({ where: { id } });
    },

    findOrCreatePost(id: string, title: string, url: string) {
        return Post.findOrCreate({ where: { id }, defaults: { title, url } });
    },
};
