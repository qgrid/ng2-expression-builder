import { Pipe, PipeTransform } from '@angular/core';
import { MarkupVisitor } from './schema/markup.visitor';
import { ISerializationNode } from '../expression-builder/serialization.service';
import { visit as convert } from './schema/converter';
import { Validator } from './schema/validator';
import { IConditionBuilderModel } from './condition-builder.model';
import * as fieldService from '../infrastructure/field.service';
import { Guard } from '../infrastructure/guard';

@Pipe({
    name: 'qConditionNodeMarkup',
    pure: false
})
export class ConditionNodePipe implements PipeTransform {
    visitor: MarkupVisitor;

    transform(value: any, model: IConditionBuilderModel): any {
        Guard.notNull(model, 'model');

        const node = value as ISerializationNode;
        if (node) {
            if (!this.visitor) {
                const validator = new Validator(model);
                const columnMap = fieldService.map(model.fields);
                this.visitor =
                    new MarkupVisitor(
                        key => columnMap[key].title,
                        key => columnMap[key].type,
                        (k, v) => validator.for(k)(v).length === 0
                    );
            }

            const expression = convert(node);
            if (expression) {
                return this.visitor.visit(expression);
            }
        }

        return null;
    }
}
