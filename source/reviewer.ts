import { ReviewerOptions } from './typings/reviewer';
import { getCodaObjectFromWindow } from './utils';

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
            this.renderReviewerLoginBox();
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

    }
}
