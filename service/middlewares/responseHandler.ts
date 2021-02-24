const sendHandle = () => {
    const response = (ctx, isSuccess: boolean, data: any, msg: string) => {
        ctx.set('Content-Type', 'application/json');
        ctx.body = {
            success: isSuccess,
            msg,
            response: data,
        };
    };

    const success = (ctx) => (data: any, msg: string = '请求成功') => response(ctx, true, data, msg);

    const error = (ctx) => (msg: string = '请求失败') => response(ctx, false, null, msg);

    return async (ctx, next) => {
        ctx.send = success(ctx);
        ctx.sendError = error(ctx);
        await next();
    };
};

export default sendHandle;
