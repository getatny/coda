import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';
import 'tippy.js/animations/shift-away-extreme.css';

export default async (selector) => {
    const tippy = (await import(/* webpackChunkName: "coda-popover" */'tippy.js')).default;

    tippy(selector, {
        content(reference: HTMLElement) {
            return reference.nextElementSibling;
        },
        allowHTML: true,
        theme: 'light',
        interactive: true,
        hideOnClick: true,
        trigger: 'click',
        placement: 'auto',
        offset: [0, 15],
        animation: 'shift-away-extreme',
    });
};
