import {AppError} from  './error';
import {isUndefined, isFunction} from './utility';

export class Guard {
	static notNull(value, name) {
		if (value === null || isUndefined(value)) {
			throw new AppError('guard.notNull', name);
		}
	}
}