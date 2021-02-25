export const errorResolver = async (fn, ctx) => {
    try {
        await fn();
    } catch (err) {
        console.error(err);
        ctx.sendError(err);
    }
};
