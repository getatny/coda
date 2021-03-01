import { escape } from 'html-escaper';
import { ReviewerOptions } from './typings/reviewer';
// eslint-disable-next-line import/no-cycle
import { getCodaObjectFromWindow, removeReviewerInfos, storeReviewerInfos } from './utils/commons';
import Message from './utils/message';
import popover from './utils/popover';

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
        this.renderReviewerLoginBox();

        if (this.email) {
            this.renderReviewerProfile();
        } else {
            this.disableCommentBox();
        }

        this.bindReviewerEvent();
    }

    renderReviewerProfile = () => {
        const mainElement = getCodaObjectFromWindow()?.main;
        const { avatarMirror, defaultAvatar } = getCodaObjectFromWindow()?.configs;

        mainElement.querySelector('.comment-header').innerHTML += `
            <div class="coda-popover-wrapper">
                <div class="user-profile">
                    <img src="${avatarMirror}/${md5(this.email)}?d=${encodeURIComponent(defaultAvatar)}" alt="${this.nickname}-avatar" width="20px" height="20px" />
                    ${this.nickname}
                </div>
                
                <div class="popover-content user-profile-content">
                    <img src="${avatarMirror}/${md5(this.email)}?d=${encodeURIComponent(defaultAvatar)}" alt="${this.nickname}-avatar" width="20px" height="20px" />
                    <div class="user-infos">
                        <div class="email">${this.email}</div>
                        <a class="logout">退出</a>
                    </div>
                </div>
            </div>
        `;

        mainElement.querySelector('.comment-header .logout').addEventListener('click', () => {
            removeReviewerInfos();
            this.email = '';
            this.nickname = '';
            this.website = '';
            this.afterLogout();
        });

        popover('.coda-popover-wrapper .user-profile');
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
                    <div class="remember-check">
                       <input type="checkbox" />
                       记住基本信息
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
                return;
            }

            if (this.email && target.className === 'submit-button') {
                this.validateCommentAndSubmit();
            }
        });

        document.querySelector('.coda-login-wrapper')?.addEventListener('click', (e) => {
            const { target }: { target: any } = e;

            if (target.offsetParent.className === 'close-button') {
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

    validateCommentAndSubmit = () => {
        const { main: mainElement, controller, commentId } = getCodaObjectFromWindow();
        const commentBox: HTMLTextAreaElement = mainElement.querySelector('.comment-box textarea');
        const comment = commentBox.value;

        if (comment.trim() === '') {
            Message.error('评论内容不能为空');
        } else {
            controller.submitComment({
                commentContent: escape(comment),
                email: this.email,
                nickname: this.nickname,
                website: this.website,
                parentId: commentId,
                notify: 1,
            }).then((res) => {
                if (res.success) {
                    Message.success('发布成功');
                    commentBox.value = '';
                }
            }).catch(() => {
                Message.error('发布失败');
            });
        }
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

    enableCommentBox = () => {
        const mainElement = getCodaObjectFromWindow()?.main;
        mainElement.querySelector('.comment-box textarea').setAttribute('disabled', 'false');
    }

    afterLogin = () => {
        this.enableCommentBox();
        this.renderReviewerProfile();
        this.hideLoginWindow();
    }

    afterLogout = () => {
        const mainElement: Element = getCodaObjectFromWindow()?.main;

        (mainElement.querySelector('.comment-header .coda-popover-wrapper') as HTMLElement).style.display = 'none';
        this.disableCommentBox();
    }

    verifyAndStoreReviewer = () => {
        const [email, nickname, website] = Array.from(document.querySelectorAll('.coda-login-wrapper .basic-infos .info-item input')).map((el: any) => el.value);

        if (email === '' || nickname === '') {
            Message.error('请完善必填项');
            return;
        }

        if (website !== '' && !/(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?/.test(website)) {
            Message.error('请填写正确的网址');
            return;
        }

        // 校验通过
        this.nickname = nickname;
        this.website = website;

        const remember = (document.querySelector('.coda-login-wrapper .basic-infos .remember-check input') as HTMLInputElement).checked;

        if (remember) {
            // 缓存用户数据
            storeReviewerInfos({
                email: this.email,
                nickname: this.nickname,
                website: this.website,
            });
        }

        Message.success('已提交');
        this.afterLogin();
    }
}
