import { ExpressionBuilder } from '../expression-builder/model/expression.builder';
import { Node } from '../expression-builder/model/node';

export interface IConditionBuilderSchema {
	apply(node?: Node): Node;
	attr(key: string, value: any): IConditionBuilderSchema;
	node(id: string, build: (schema: IConditionBuilderSchema) => void): IConditionBuilderSchema;
	group(id: string, build: (schema: IConditionBuilderSchema) => void): IConditionBuilderSchema;
	get(id: string): IConditionBuilderSchema;
	materialize(id: string): Node;

	autocomplete(id: string, settings?: any): IConditionBuilderSchema;
	button(id: string, settings?: any): IConditionBuilderSchema;
	input(id: string, settings?: any): IConditionBuilderSchema;
	iconButton(id: string, settings?: any): IConditionBuilderSchema;
	label(id: string, settings?: any): IConditionBuilderSchema;
	multiselect(id: string, settings?: any): IConditionBuilderSchema;
	select(id: string, settings?: any): IConditionBuilderSchema;
}

export class ConditionBuilderService {
	constructor() {
	}

	build(): IConditionBuilderSchema {
		const statements = [
			{
				type: 'label',
				templateKey: 'eb-label-tpl.component.html'
			},
			{
				type: 'input',
				templateKey: 'eb-input-tpl.component.html'
			},
			{
				type: 'select',
				templateKey: 'eb-select-tpl.component.html'
			},
			{
				type: 'button',
				templateKey: 'eb-button-tpl.component.html'
			},
			{
				type: 'iconButton',
				templateKey: 'eb-icon-button-tpl.component.html'
			},
			{
				type: 'autocomplete',
				templateKey: 'eb-autocomplete-tpl.component.html'
			},
			{
				type: 'multiselect',
				templateKey: 'eb-multiselect-tpl.component.html'
			}
		];

		const settings = {
			defaults: {
				isValid: function () {
					return !this.validate || !(this.state = this.validate()).length;
				}
			}
		};

		return new ExpressionBuilder(settings)
			.build<IConditionBuilderSchema>(statements);
	}
}
