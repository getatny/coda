export const getCodaObjectFromWindow = (uniqKey: string) => (window as any).codaObjs[uniqKey];

export const bindObjectToWindow = (uniqKey: string, key: string, value: any) => {
    if (!(window as any).codaObjs) {
        (window as any).codaObjs = {};
    }

    if (!(window as any).codaObjs[uniqKey]) {
        (window as any).codaObjs[uniqKey] = {};
    }

    (window as any).codaObjs[uniqKey][key] = value;
};
