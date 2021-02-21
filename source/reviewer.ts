import { ReviewerOptions } from './typings/reviewer';

export default class Reviewer {
    constructor(options: ReviewerOptions) {
        this.email = options.email || '';
        this.nickname = options.nickname || '';
        this.website = options.website || '';
        this.avatarMirror = options.avatarMirror;
        this.defaultAvatar = options.defaultAvatar;
    }

    email: string;

    nickname: string;

    website: string;

    avatarMirror: string; // avatar mirror link, based on gravatar

    defaultAvatar: string;
}
