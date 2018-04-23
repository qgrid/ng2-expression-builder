import { Field } from '../condition-builder/condition-builder.model';

export declare type FieldMap = { [key: string]: Field };

export function map(columns: Array<Field>): FieldMap {
    return columns.reduce((memo, field) => {
        memo[field.key] = field;
        return memo;
    }, {});
}
