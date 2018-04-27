import { AppError } from './error';
import { isUndefined, isFunction } from './utility';

export class Guard {
	static notUndefined(value, name: string) {
		if (isUndefined(value)) {
			throw new AppError('guard.notUndefined', name);
		}
	}


	static notNull(value, name: string) {
		if (value === null || isUndefined(value)) {
			throw new AppError('guard.notNull', name);
		}
	}

	static notNullOrEmpty(value, name: string) {
		if (value === null || isUndefined(value) || value === '') {
			throw new AppError('guard.notNullOrEmpty', name);
		}
	}

	static invokable(value, name: string) {
		if (!isFunction(value)) {
			throw new AppError('guard.invokable', name);
		}
	}
}