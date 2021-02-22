import { ReviewerOptions } from './typings/reviewer';
import { getCodaObjectFromWindow } from './utils';
import Message from './message';

const md5 = require('js-md5');

export default class Reviewer {
    constructor(options: ReviewerOptions) {
        this.email = options.email || '';
        this.nickname = options.nickname || '';
        this.website = options.website || '';
        this.avatarMirror = options.avatarMirror;
        this.defaultAvatar = options.defaultAvatar;
        this.codaUniqKey = options.uniqKey;

        this.init();
    }

    email: string;

    nickname: string;

    website: string;

    avatarMirror: string; // avatar mirror link, based on gravatar

    defaultAvatar: string;

    codaUniqKey: string;

    init = () => {
        if (this.email) {
            this.renderReviewerProfile();
        } else {
            this.disableCommentBox();
            this.renderReviewerLoginBox();
            this.bindLoginEvent();
        }
    }

    renderReviewerProfile = () => {
        const mainElement = getCodaObjectFromWindow(this.codaUniqKey)?.main;

        mainElement.querySelector('.operate-menus').innerHTML += `
            <div class="user-profile">
                <i class="iconfont icon-user"></i>
            </div>
        `;
    }

    renderReviewerLoginBox = () => {
        const codaLogin = document.body.querySelector('.coda-login-wrapper');

        if (!codaLogin) {
            const codaLoginWrapper = document.createElement('div');
            codaLoginWrapper.className = 'coda-login-wrapper';

            codaLoginWrapper.innerHTML = `
                <div class="close-button">
                    <i class="iconfont icon-close"></i>
                </div>
                <div class="avatar">
                    <img src="${this.avatarMirror}/${md5(this.email)}?d=${encodeURIComponent(this.defaultAvatar)}" alt="${this.nickname}-avatar" />
                </div>
                <div class="basic-infos">
                    <div class="info-item">
                        <input type="text" />
                    </div>
                    <div class="info-item">
                        <input type="text" />
                    </div>
                    <div class="info-item">
                        <input type="text" />
                    </div>
                </div>
            `;

            document.body.appendChild(codaLoginWrapper);
        }
    }

    bindLoginEvent = () => {
        const mainElement: Element = getCodaObjectFromWindow(this.codaUniqKey)?.main;

        mainElement.addEventListener('click', (e) => {
            const { target }: { target: any } = e;

            if (['comment-box', 'operate-menus', 'tool-bar'].includes(target.parentNode.className) || target.className === 'reply-to') {
                Message.error('您需要填写基本信息才能评论');
                document.querySelector('.coda-login-wrapper').classList.add('show');
            }
        });

        document.querySelector('.coda-login-wrapper .close-button').addEventListener('click', () => {
            document.querySelector('.coda-login-wrapper').classList.remove('show');
            document.querySelector('.coda-login-wrapper').classList.add('hidden');
        });
    }

    disableCommentBox = () => {
        const mainElement = getCodaObjectFromWindow(this.codaUniqKey)?.main;
        mainElement.querySelector('.comment-box textarea').setAttribute('disabled', 'true');
    }
}
