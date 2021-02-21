import Controller from '../controller';

export type ReviewerOptions = {
    email?: string;
    nickname?: string;
    website?: string;
    controller: Controller;
    avatarMirror: string;
    defaultAvatar: string;
}
