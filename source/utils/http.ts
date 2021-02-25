import Message from '../message';

export type ApiResult = {
    success: boolean;
    msg: string;
    response: any;
}

export const get = (url: string): Promise<ApiResult> => new Promise((resolve) => {
    fetch(url).then(async (res) => {
        const result = await res.json();

        if (result.success) {
            resolve(result);
        } else {
            Message.error(result.msg);
        }
    }).catch(() => {
        Message.error('请求失败');
    });
});

export const post = (url: string, data: any): Promise<ApiResult> => new Promise((resolve) => {
    fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(async (res) => {
        const result = await res.json();

        if (result.success) {
            resolve(result);
        } else {
            Message.error(result.msg);
        }
    }).catch(() => {
        Message.error('请求失败');
    });
});
