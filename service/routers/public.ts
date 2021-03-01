import commentController from '../controllers/comment';

const Router = require('koa-better-router');

const router = Router().loadMethods();

router.get('/comments/:key/:page/:pageSize', commentController.getComments);
router.post('/comment/create', commentController.createComment);

const api = Router({ prefix: '/rest/public' }).extend(router);

export default api;
