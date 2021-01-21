import { IConditionBuilderModel } from '../condition-builder.model';
import { Node } from '../../expression-builder/model/node';
import { Line } from '../../expression-builder/model/line';
import { GroupExpression } from '../../expression-builder/model/expression';

export function suggestFactory(model: IConditionBuilderModel, name: string) {
    return function (node: Node, line: Line) {
        const search = this.value == null ? '' : ('' + this.value).toLowerCase();
        const field = ((line.get(name) as GroupExpression).expressions[0] as any).value;
        return model.getSuggests(field, 0, 10, search);
    };
}

export function suggestsFactory(model: IConditionBuilderModel, name: string) {
    return function (node: Node, line: Line) {
        const search = this.search;
        const field = ((line.get(name) as GroupExpression).expressions[0] as any).value;
        const selection =
            (this.values || [])
                .map(item => ('' + item).toLowerCase());

        return new Promise((resolve, reject) =>
            model
                .getSuggests(field, 0, 10, search, selection)
                .then(items => {
                    const result = selection.length
                        ? items.filter(item => selection.indexOf(('' + item).toLowerCase()) < 0)
                        : items;
                })
                .catch(ex => reject(ex))
        );
    };
}
