import path from 'path';

import Koa from 'koa';
import logger from 'koa-logger';
import serve from 'koa-static';
import compress from 'koa-compress';
import bodyparser from 'koa-bodyparser';
import cors from '@koa/cors';
import json from 'koa-json';
import dayjs from 'dayjs';

import config from './utils/config';
import responseHandler from './middlewares/responseHandler';
import authErrorHandler from './middlewares/authErrorHandler';
import publicApi from './routers/public';

const app = new Koa();

app.use(logger());
app.use(bodyparser());
app.use(compress({
    filter(contentType) {
        return /javascript|css/i.test(contentType);
    },
    threshold: 2048,
}));

app.use(serve(path.resolve(__dirname, '..', 'dist')));

app.use(cors({
    origin(ctx) {
        let isWhiteList = null;
        const whiteList = config.getConfig('api.whiteList').split(',');
        whiteList.forEach((item) => {
            if (ctx.request.header.origin.indexOf(item) > -1) {
                isWhiteList = ctx.request.header.origin;
            }
        });
        return isWhiteList;
    },
}));
app.use(json({ pretty: false, param: 'pretty' }));

app.use(responseHandler());
app.use(authErrorHandler);

app.use(publicApi.middleware());

app.listen(config.getConfig('port'), () => {
    // eslint-disable-next-line no-console
    console.info(`[Info] ${dayjs().format('YYYY-MM-DD hh:mm:ss')}: Coda service started on port: ${config.getConfig('port')}`);
});
