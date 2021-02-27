import Reviewer from '../reviewer';
import Controller from '../controller';

type CodaObj = {
    main: Element;
    controller: Controller;
    reviewer: Reviewer;
    configs: {
        [key: string]: string;
    }
}

type reviewerInfos = {
    email: string;
    nickname: string;
    website: string;
}

export const getCodaObjectFromWindow = (): CodaObj => (window as any).codaObjs;

export const storeValueToWindow = (key: string, value: any) => {
    if (!(window as any).codaObjs) {
        (window as any).codaObjs = {};
    }

    (window as any).codaObjs[key] = value;
};

export const removeValueFromWindow = (key: string) => {
    if (!(window as any).codaObjs) {
        return;
    }

    (window as any).codaObjs[key] = null;
};

export const getReviewerInfos = (): reviewerInfos => JSON.parse(localStorage.getItem('coda-reviewer-infos'));

export const removeReviewerInfos = () => localStorage.removeItem('coda-reviewer-infos');

export const storeReviewerInfos = (infos: reviewerInfos) => {
    localStorage.setItem('coda-reviewer-infos', JSON.stringify(infos));
};
