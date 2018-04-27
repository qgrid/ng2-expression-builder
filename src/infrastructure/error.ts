import { isFunction } from './utility';

export class AppError extends Error {
	constructor(name: string, message: string) {
		super(message);

		this.name = this.constructor.name;
		this.message = `q-expression-builder.${name}: ${message}`;
		const ErrorCons = Error as any;
		if (isFunction(ErrorCons.captureStackTrace)) {
			ErrorCons.captureStackTrace(this, this.constructor);
		} else {
			this.stack = (new Error(message)).stack;
		}
	}
}