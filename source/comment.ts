import { format } from 'timeago.js';
import { Comment as CommentOption } from './typings/comment';
import { getCodaObjectFromWindow, removeValueFromWindow, storeValueToWindow } from './utils/commons';

const md5 = require('js-md5');

export default class Comment {
    constructor({
        id,
        content,
        createdAt,
        email,
        nickname,
        notify,
        parentId,
        status,
        website,
        author,
    }: CommentOption) {
        this.id = id;
        this.content = content;
        this.createdAt = createdAt;
        this.email = email;
        this.nickname = nickname;
        this.notify = notify;
        this.parentId = parentId;
        this.status = status;
        this.website = website;
        this.author = author;

        this.init();
    }

    id: string;

    parentId: string;

    email: string;

    nickname: string;

    website: string;

    status: number;

    notify: boolean;

    createdAt: string;

    content: string;

    author: boolean;

    static generateHTML = (data: CommentOption) => {
        const codaConfig = getCodaObjectFromWindow().configs;

        return `
            <div class="comment">
                <div class="comment-block">
                    <div class="left avatar">
                        <img 
                            src="${codaConfig.avatarMirror}/${md5(data.email)}?d=${encodeURIComponent(codaConfig.defaultAvatar)}" 
                            alt="${data.nickname}-avatar" 
                            width="50px"
                            height="50px"
                        />
                    </div>
                    <div class="right">
                        <div class="content">
                            ${data.content}
                        </div>
                        <div class="infos-bar">
                            ${data.status === 0 ? '<div class="pending-approval" title="评论审核中，仅您可见"></div>' : ''}
                            ${data.author ? '<div class="author" title="作者"><i class="iconfont icon-verify"></i></div>' : ''}
                            <div class="nickname">${data.nickname}</div>
                            <div class="comment-time">${format(Date.parse(data.createdAt), 'zh_CN')}</div>
                            <div class="operations">
                                <a class="reply-to" data-comment-id="${data.id}" data-reply-to="${data.nickname}">回复</a>
                                ${data.parentId ? `<a class="conversation" data-parent-id="${data.parentId}">查看对话</a>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="comment-box-placeholder"></div>
            </div>
        `;
    }

    static handleClickEvent = (e) => {
        const { reviewer: { email }, main } = getCodaObjectFromWindow();
        const { target }: { target: any } = e;

        if (email && target.className === 'reply-to') {
            // 评论
            const commentBox = main.querySelector('.coda-wrapper .comment-box');

            target
                .parentElement
                .parentElement
                .parentElement
                .parentElement
                .nextElementSibling
                .appendChild(commentBox);

            storeValueToWindow('replyTo', target.dataset.replyTo);
            storeValueToWindow('commentId', target.dataset.commentId);
        } else if (target.className === 'cancel-reply') {
            // 取消评论
            const commentBox = main.querySelector('.coda-wrapper .comment-box');
            main.firstElementChild.insertAdjacentElement('afterbegin', commentBox);

            removeValueFromWindow('replyTo');
            removeValueFromWindow('commentId');
        }
    }

    init = () => {
        this.bindReplayEvents();
    }

    getTemplate = () => Comment.generateHTML(this)

    bindReplayEvents = () => {
        const { main } = getCodaObjectFromWindow();

        main.querySelector('.comment-list').addEventListener('click', Comment.handleClickEvent);
    }
}
