import { ReviewerOptions } from './typings/reviewer';
import { getCodaObjectFromWindow, storeReviewerInfos } from './utils/commons';
import Message from './message';

const md5 = require('js-md5');

export default class Reviewer {
    constructor(options: ReviewerOptions) {
        this.email = options.email || '';
        this.nickname = options.nickname || '';
        this.website = options.website || '';

        this.init();
    }

    email: string;

    nickname: string;

    website: string;

    init = () => {
        if (this.email) {
            this.renderReviewerProfile();
        } else {
            this.disableCommentBox();
            this.renderReviewerLoginBox();
        }

        this.bindReviewerEvent();
    }

    renderReviewerProfile = () => {
        const mainElement = getCodaObjectFromWindow()?.main;

        mainElement.querySelector('.operate-menus').innerHTML += `
            <div class="user-profile">
                <i class="iconfont icon-user"></i>
            </div>
        `;
    }

    renderReviewerLoginBox = () => {
        const codaLogin = document.body.querySelector('.coda-login-wrapper');
        const { avatarMirror, defaultAvatar } = getCodaObjectFromWindow()?.configs;

        if (!codaLogin) {
            const codaLoginWrapper = document.createElement('div');
            codaLoginWrapper.className = 'coda-login-wrapper';

            codaLoginWrapper.innerHTML = `
                <div class="close-button">
                    <i class="iconfont icon-close"></i>
                </div>
                <div class="avatar">
                    <img src="${avatarMirror}/${md5(this.email)}?d=${encodeURIComponent(defaultAvatar)}" alt="${this.nickname}-avatar" width="70px" height="70px" />
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

    bindReviewerEvent = () => {
        const mainElement: Element = getCodaObjectFromWindow()?.main;

        mainElement.addEventListener('click', (e) => {
            const { target }: { target: any } = e;

            if (!this.email && (['comment-box', 'operate-menus', 'tool-bar'].includes(target.parentNode.className) || target.className === 'reply-to')) {
                Message.error('您需要填写基本信息才能评论');
                this.showLoginWindow();
            }
        });

        document.querySelector('.coda-login-wrapper')?.addEventListener('click', (e) => {
            const { target }: { target: any } = e;

            if (target.className === 'close-button') {
                this.hideLoginWindow();
            } else if (target.className === 'login-button') {
                this.verifyAndStoreReviewer();
            }
        });

        document.querySelector('.coda-login-wrapper .basic-infos .info-item input')?.addEventListener('blur', (e) => {
            const email = (e.target as any).value;

            if (!(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email))) {
                Message.error('请填写正确的邮箱');
            } else {
                this.email = email;
                const { avatarMirror, defaultAvatar } = getCodaObjectFromWindow()?.configs;
                (document.querySelector('.coda-login-wrapper .avatar img') as HTMLImageElement).src = `${avatarMirror}/${md5(this.email)}?d=${encodeURIComponent(defaultAvatar)}`;
            }
        });
    }

    showLoginWindow = () => {
        document.querySelector('.coda-login-wrapper').className = 'coda-login-wrapper show';
    }

    hideLoginWindow = () => {
        document.querySelector('.coda-login-wrapper').className = 'coda-login-wrapper hidden';
    }

    disableCommentBox = () => {
        const mainElement = getCodaObjectFromWindow()?.main;
        mainElement.querySelector('.comment-box textarea').setAttribute('disabled', 'true');
    }

    verifyAndStoreReviewer = () => {
        const [email, nickname, website] = Array.from(document.querySelectorAll('.coda-login-wrapper .basic-infos .info-item input')).map((el: any) => el.value);

        if (email === '' || nickname === '') {
            Message.error('请完善必填项');
            return;
        }

        if (website !== '' && !/(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(website)) {
            Message.error('请填写正确的网址');
            return;
        }

        // 校验通过
        this.nickname = nickname;
        this.website = website;

        // 缓存用户数据
        storeReviewerInfos({ email: this.email, nickname: this.nickname, website: this.website });
        Message.success('已提交');
        this.hideLoginWindow();
    }
}
