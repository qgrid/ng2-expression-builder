import isFunction from 'lodash-es/isFunction';
import isString from 'lodash-es/isString';
import isArray from 'lodash-es/isArray';
import isObject from 'lodash-es/isObject';
import isUndefined from 'lodash-es/isUndefined';
import uniq from 'lodash-es/uniq';
import clone from 'lodash-es/clone';
import cloneDeep from 'lodash-es/cloneDeep';

const noop = () => { };
const yes = () => true;
const no = () => false;
const identity = arg => arg;

function defaults<T>(...args: any[]): T {
    const dst = args[0];
    const result = { ...dst } as T;

    for (let i = 1, sourcesLength = args.length; i < sourcesLength; i++) {
        const source = args[i];

        if (!source) {
            continue;
        }

        const keys = Object.keys(source);

        for (let k = 0, keysLength = keys.length; k < keysLength; k++) {
            const key = keys[k];
            if (!result.hasOwnProperty(key)) {
                result[key] = source[key];
            }
        }
    }

    return result;
}

function override(dst, src) {
    const keys = Object.keys(src);
    const length = keys.length;

    for (let i = 0; i < length; i++) {
        const key = keys[i];
        dst[key] = src[key];
    }

    return dst;
}

export {
    isFunction,
    isString,
    isArray,
    isObject,
    isUndefined,
    uniq,
    clone,
    cloneDeep,
    noop,
    yes,
    no,
    identity,
    defaults,
    override
};

