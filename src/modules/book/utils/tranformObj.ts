// eslint-disable-next-line
export const transformRowData = (obj: any) => {
    const result = {};
    for (const key in obj) {
        const keys = key.split(".");
        // eslint-disable-next-line
        let currentObj: any = result;

        for (let i = 0; i < keys.length - 1; i++) {
            currentObj[keys[i]] = currentObj[keys[i]] || {};
            currentObj = currentObj[keys[i]];
        }

        currentObj[keys[keys.length - 1]] = obj[key];
    }

    return result;
}