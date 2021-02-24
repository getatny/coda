export default class Message {
    static template = `
        <i class="iconfont %iconType%"></i>
        <div class="content">
            %messageContent%
        </div>
    `;

    static mainElement = null;

    static timer = null;

    static show = ({ type, message }: {
        type: 'success' | 'error' | 'warning';
        message: string;
    }) => {
        const codaMessage = document.body.querySelector('.coda-message');

        if (!codaMessage) {
            Message.mainElement = document.createElement('div');
            Message.mainElement.className = 'coda-message show';
            Message.mainElement.innerHTML = Message.template.replace('%messageContent%', message).replace('%iconType%', `icon-${type}`);
            document.body.appendChild(Message.mainElement);
        } else {
            Message.rerenderMessage(type, message);
            Message.showMessage();
        }

        if (Message.timer) {
            clearTimeout(Message.timer);
        }

        Message.timer = setTimeout(() => {
            Message.hideMessage();
        }, 5000);
    }

    static hideMessage = () => {
        Message.mainElement.className = 'coda-message hidden';
    }

    static showMessage = () => {
        Message.mainElement.className = 'coda-message show';
    }

    static rerenderMessage = (type, message) => {
        Message.mainElement.children[0].className = `iconfont icon-${type}`;
        Message.mainElement.children[1].innerText = message;
    }

    static success = (message) => {
        Message.show({ type: 'success', message });
    }

    static error = (message) => {
        Message.show({ type: 'error', message });
    }

    static warning = (message) => {
        Message.show({ type: 'warning', message });
    }
}
