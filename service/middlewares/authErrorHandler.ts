const errorHandle = (ctx, next) => next().catch((err) => {
    if (err.status === 401) {
        ctx.status = 401;
        return ctx.sendError('未授权，访问被拒绝');
    }
    throw err;
});

export default errorHandle;
