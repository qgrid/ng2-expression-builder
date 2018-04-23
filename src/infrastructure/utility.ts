import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import isUndefined from 'lodash/isUndefined';
import uniq from 'lodash/uniq';
import clone from 'lodash/clone';
import cloneDeep from 'lodash/cloneDeep';

const noop = () => { };
const yes = () => true;
const no = () => false;
const identity = arg => arg;

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
    identity
};
