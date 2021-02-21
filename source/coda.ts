import { CodaOptions } from './typings/coda';
import Controller from './controller';
import Reviewer from './reviewer';

import './styles/coda.less';

class CodaBase {
    constructor(options: CodaOptions) {
        const element = document.querySelector(options.selector);

        if (element) {
            this.mainElement = element;

            this.init(options);
        } else {
            throw new Error(`Coda: 未找到元素${options.selector}`);
        }
    }

    mainElement: Element;

    controller: Controller;

    reviewer: Reviewer;

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
            controller: this.controller,
            avatarMirror: options.avatarMirror,
            defaultAvatar: options.defaultAvatar,
            ...reviewerCache || {},
        });
    }

    generateCommentBox = () => {
        this.mainElement.innerHTML = `
            <div class="coda-wrapper">
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
            </div>
        `;
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
