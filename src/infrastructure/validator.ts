import * as LIVR from 'livr';

export declare class IValidator {
    constructor(schema: any);

    validate(value: any): boolean;
    getErrors(): { [key: string]: Array<string> | string };
}

export const Validator: typeof IValidator = LIVR.Validator;