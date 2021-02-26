import { CodaOptions } from './typings/coda';
import Controller from './controller';
import Reviewer from './reviewer';
import {
    storeValueToWindow,
    getCodaObjectFromWindow, getReviewerInfos,
} from './utils/commons';
import Comment from './comment';

import './styles/coda.less';

class CodaBase {
    constructor(options: CodaOptions) {
        const element = document.querySelector(options.selector);

        if (element) {
            storeValueToWindow('main', element);
            storeValueToWindow('configs', options);

            this.init(options);
        } else {
            throw new Error(`Coda: 未找到元素${options.selector}`);
        }
    }

    controller: Controller;

    reviewer: Reviewer;

    init = async (options: CodaOptions) => {
        // render comment box
        this.generateCommentBox();

        // init service controller and get comments from service
        this.controller = new Controller({
            key: options.key,
            title: options.title,
            pageSize: options.pageSize,
            url: options.url,
            serviceUrl: options.serviceUrl,
        });

        // init reviewer
        const reviewerCache = getReviewerInfos();
        this.reviewer = new Reviewer(reviewerCache || {});

        storeValueToWindow('controller', this.controller);
        storeValueToWindow('reviewer', this.reviewer);

        // render comment list
        await this.generateCommentElement();

        this.unloading();
    }

    generateCommentBox = () => {
        const mainElement = getCodaObjectFromWindow().main;

        mainElement.innerHTML = `
            <div class="coda-wrapper loading">
                <div class="comment-box">
                    <textarea></textarea>
                    <div class="tool-bar">
                        <div class="operate-menus"></div>
                        <button class="cancel-reply">取消回复</button>
                        <button class="submit-button">提交</button>
                    </div>
                </div>
    
                <div class="comment-content">
                    <div class="comment-num">%comment-num% 条评论</div>
                    <div class="comment-list"></div>
                </div>
                
                <div class="loading-indicator">
                    <i class="iconfont icon-loading"></i>
                </div>
            </div>
        `;
    }

    generateCommentElement = async () => {
        const mainElement = getCodaObjectFromWindow().main;
        const commentElements = [];

        const res = await this.controller.getComments(this.reviewer.email);

        (res.response.comments as Comment[]).forEach((item) => {
            const comment = new Comment(item);

            commentElements.push(comment.getTemplate());
        });

        const commentsCount = mainElement.querySelector('.comment-num');
        commentsCount.innerHTML = commentsCount.innerHTML.replace('%comment-num%', res.response.count);
        mainElement.querySelector('.comment-list').innerHTML = commentElements.join('');
    }

    unloading = () => {
        const mainElement = getCodaObjectFromWindow().main;
        mainElement.querySelector('.coda-wrapper').classList.remove('loading');
    }

    loading = () => {
        const mainElement = getCodaObjectFromWindow().main;
        mainElement.querySelector('.coda-wrapper').classList.add('loading');
    }
}

const Coda = (options) => {
    const initOptions = {
        selector: '#coda',
        key: document.location.pathname,
        title: document.title,
        url: document.location.href,
        avatarMirror: 'https://gravatar.loli.net/avatar',
        defaultAvatar: 'mm',
        pageSize: 10,
        ...options,
    };

    return new CodaBase(initOptions);
};

(window as any).Coda = Coda;
