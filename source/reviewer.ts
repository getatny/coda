import { ReviewerOptions } from './typings/reviewer';
import { getCodaObjectFromWindow } from './utils/commons';
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
                        <label for="email">邮箱 <span>*</span></label>
                        <input type="text" id="email" placeholder="lq@wxample.com" />
                    </div>
                    <div class="info-item">
                        <label for="nickname">昵称 <span>*</span></label>
                        <input type="text" id="nickname" placeholder="Your name" />
                    </div>
                    <div class="info-item">
                        <label for="website">网址</label>
                        <input type="text" id="website" placeholder="https://" />
                    </div>
                </div>
                <button class="login-button">提交</button>
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

        document.querySelector('.coda-login-wrapper .login-button').addEventListener('click', this.verifyReviewer);
    }

    disableCommentBox = () => {
        const mainElement = getCodaObjectFromWindow(this.codaUniqKey)?.main;
        mainElement.querySelector('.comment-box textarea').setAttribute('disabled', 'true');
    }

    verifyReviewer = () => {
        const values = Array.from(document.querySelectorAll('.coda-login-wrapper .basic-infos .info-item input')).map((el: any) => el.value);

        if (values[0] === '' || values[1] === '') {
            Message.error('请完善必填项');
        } else if (!(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(values[0]))) {
            Message.error('请填写正确的邮箱');
        }

        if (values[2] !== '' && !/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(values[2])) {
            Message.error('请填写正确的网址');
        }
    }
}
