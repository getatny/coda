import { format } from 'timeago.js';

import { CodaOptions } from './typings/coda';
import Controller from './controller';
import Reviewer from './reviewer';
import { bindObjectToWindow } from './utils/commons';

import './styles/coda.less';
import { CodaComment } from '../service/controllers/typings/comment';

const md5 = require('js-md5');

class CodaBase {
    constructor(options: CodaOptions) {
        const element = document.querySelector(options.selector);

        if (element) {
            this.mainElement = element;
            this.avatarMirror = options.avatarMirror;
            this.defaultAvatar = options.defaultAvatar;
            this.authors = options.authors;
            this.uniqKey = md5((Math.random() * 10000 * 2).toString(16));
            bindObjectToWindow(this.uniqKey, 'main', this.mainElement);

            this.init(options);
        } else {
            throw new Error(`Coda: 未找到元素${options.selector}`);
        }
    }

    mainElement: Element;

    controller: Controller;

    reviewer: Reviewer;

    avatarMirror: string;

    defaultAvatar: string;

    authors: string[];

    uniqKey: string;

    init = (options: CodaOptions) => {
        // render comment box
        this.generateCommentBox();

        // init service controller and get comments from service
        this.controller = new Controller({
            key: options.key,
            title: options.title,
            pageSize: options.pageSize,
            url: options.url,
        });

        // init reviewer
        const reviewerCache = JSON.parse(localStorage.getItem('coda-reivewer-infos'));
        this.reviewer = new Reviewer({
            uniqKey: this.uniqKey,
            avatarMirror: options.avatarMirror,
            defaultAvatar: options.defaultAvatar,
            ...reviewerCache || {},
        });

        // render comment list
        this.generateCommentElement();

        bindObjectToWindow(this.uniqKey, 'controller', this.controller);
        bindObjectToWindow(this.uniqKey, 'reviewer', this.reviewer);

        this.unloading();
    }

    generateCommentBox = () => {
        this.mainElement.innerHTML = `
            <div class="coda-wrapper loading">
                <div class="comment-box">
                    <textarea></textarea>
                    <div class="tool-bar">
                        <div class="operate-menus"></div>
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

    generateCommentElement = () => {
        const commentElements = [];

        this.controller.getComments(this.reviewer.email).then((res) => {
            (res.response.comments as CodaComment[]).forEach((item) => commentElements.push(`
                <div class="comment">
                    <div class="left avatar">
                        <img src="${this.avatarMirror}/${md5(item.email)}?d=${encodeURIComponent(this.defaultAvatar)}" alt="${this.reviewer.nickname}-avatar">
                    </div>
                    <div class="right">
                        <div class="content">
                            ${item.content}
                        </div>
                        <div class="infos-bar">
                            ${item.status === 0 ? '<div class="pending-approval" title="评论审核中，仅您可见"></div>' : ''}
                            ${this.authors.includes(item.email) ? '<div class="author" title="作者"><i class="iconfont icon-verify"></i></div>' : ''}
                            <div class="nickname">${item.nickname}</div>
                            <div class="comment-time">${format(Date.parse(item.createdAt), 'zh_CN')}</div>
                            <div class="operations"></div>
                        </div>
                    </div>
                </div>
            `));

            const commentsCout = this.mainElement.querySelector('.comment-num');
            commentsCout.innerHTML = commentsCout.innerHTML.replace('%comment-num%', res.response.count);
            this.mainElement.querySelector('.comment-list').innerHTML = commentElements.join('');
        });
    }

    unloading = () => {
        this.mainElement.querySelector('.coda-wrapper').classList.remove('loading');
    }

    loading = () => {
        this.mainElement.querySelector('.coda-wrapper').classList.add('loading');
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
        authors: ['a'],
        ...options,
    };

    return new CodaBase(initOptions);
};

(window as any).Coda = Coda;
