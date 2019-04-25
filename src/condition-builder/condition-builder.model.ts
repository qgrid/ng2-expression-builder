import { AppError } from '../infrastructure/error';
import { isUndefined, uniq } from '../infrastructure/utility';
import { typeMapping as operators } from './schema/operator';
import * as fieldService from '../infrastructure/field.service';

export interface Field {
    key: string;
    title: string;
    type: string;
}

export declare type FieldMap = { [key: string]: Field };

export interface IConditionBuilderModel {
    readonly fields: Array<Field>;
    getSuggests(key, skip, take, search, selection?: Array<string>): Promise<string[]>;
}

export class ConditionBuilderModel implements IConditionBuilderModel {
    constructor(
        public fields: Array<Field>,
        private getValues: (field: Field) => any[],
        public getOperators?: (field: Field) => string[]) {
        if (!getOperators) {
            this.getOperators = (field: Field) => operators[field.type] || [];
        }
    }

    getSuggests(key, skip, take, search, selection: Array<string> = []): Promise<string[]> {
        const fieldMap = fieldService.map(this.fields);
        const field = fieldMap[key];
        if (!field) {
            throw new AppError('condition-builder.service', `Column ${key} is not found`);
        }

        selection = selection.map(item => ('' + item).toLowerCase());
        return new Promise(resolve => {
            const view =
                this.getValues(field)
                    .filter(value =>
                        !isUndefined(value) &&
                        value !== '' &&
                        value !== null &&
                        selection.indexOf(('' + value).toLowerCase()) < 0
                    );

            const uniqueView = uniq(view);
            const sortedView = uniqueView.sort();
            const searchText = ('' + search).toLowerCase();
            const filterView = searchText
                ? sortedView.filter(x => ('' + x).toLowerCase().indexOf(searchText) >= 0)
                : sortedView;

            const toggleView = filterView.length ? filterView : sortedView;
            const pageView = toggleView.slice(skip, take);
            resolve(pageView);
        });
    }
}
