import * as http from './utils/http';
import { ControllerOptions } from './typings/controller';

const md5 = require('js-md5');

export default class Controller {
    constructor(options: ControllerOptions) {
        this.currentPage = 1;
        this.pageSize = options.pageSize;
        this.key = md5(options.key);
        this.title = options.title;
        this.url = options.url;
        this.serviceUrl = options.serviceUrl || this.getServerPathByJSLink();
    }

    currentPage: number;

    pageSize: number;

    serviceUrl: string;

    key: string;

    title: string;

    url: string;

    getServerPathByJSLink = () => {
        const schema = Array.from(document.scripts).find((item) => item.src.indexOf('coda.js') > -1).src.match(/^(\S*):\/\//)[1];
        const server = Array.from(document.scripts).find((item) => item.src.indexOf('coda.js') > -1).src.match(/http[s]?:\/\/(\S*)\//)[1];
        return `${schema}://${server}`;
    }

    getComments = (email: string) => http.get(`${this.serviceUrl}/rest/public/comments/${this.key}/${this.currentPage}/${this.pageSize}${email ? `?email=${email}` : ''}`)

    submitComment = (data) => http.post(`${this.serviceUrl}/rest/public/comment/create`, {
        key: this.key,
        title: this.title,
        url: this.url,
        ...data,
    })
}
