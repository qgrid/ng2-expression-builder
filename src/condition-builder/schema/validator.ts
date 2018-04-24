import { AppError } from '../../infrastructure/error';
import { isArray } from '../../infrastructure/utility';
import { IConditionBuilderModel } from '../condition-builder.model';
import { FieldMap } from '../../infrastructure/field.service';
import * as fieldService from '../../infrastructure/field.service';
import { Validator as LIVRValidator } from '../../infrastructure/livr';

export class Validator {
	private fieldMap: FieldMap;
	private trueResult: Array<string> = [];
	private validators: { [key: string]: (value: any) => Array<string> } = {};
	private rules = {
		'bool': ['required'],
		'currency': ['required', 'decimal'],
		'date': ['required', 'iso_date'],
		'email': ['required' /*, 'email'*/],
		'file': ['required'],
		'id': ['required'],
		'image': ['required'],
		'number': ['required', 'decimal'],
		'password': ['required'],
		'url': ['required'/*, 'url'*/],
		'reference': ['required'],
		'text': ['required', 'string'],
		'time': ['required']
	};

	constructor(model: IConditionBuilderModel) {
		this.fieldMap = fieldService.map(model.fields);
	}

	for(key: string) {
		const validators = this.validators;
		if (validators.hasOwnProperty('key')) {
			return validators[key];
		}

		const column = this.fieldMap[key];
		if (!column) {
			throw new AppError('validator', `Can't find column ${key}`);
		}

		const trueResult = this.trueResult;
		const id = column.type;
		const rule = this.rules[id];
		let validate = (value: any) => trueResult;
		if (rule) {
			const schema = { [id]: rule };
			validate = function test(value): Array<string> {
				if (isArray(value)) {
					const result = [];
					for (const item of value) {
						result.push(...test(item));
					}

					return result;
				}

				const target = { [id]: value };
				const validator = new LIVRValidator(schema);
				const isValid = validator.validate(target);
				if (isValid) {
					return trueResult;
				}

				const error = validator.getErrors()[id] as any;
				return isArray(error) ? error : [error];
			};
		}

		validators[key] = validate;
		return validate;
	}
}
