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
				templateKey: 'plugin-eb-label.tpl.html'
			},
			{
				type: 'input',
				templateKey: 'plugin-eb-input.tpl.html'
			},
			{
				type: 'select',
				templateKey: 'plugin-eb-select.tpl.html'
			},
			{
				type: 'button',
				templateKey: 'plugin-eb-button.tpl.html'
			},
			{
				type: 'iconButton',
				templateKey: 'plugin-eb-icon-button.tpl.html'
			},
			{
				type: 'autocomplete',
				templateKey: 'plugin-eb-autocomplete.tpl.html'
			},
			{
				type: 'multiselect',
				templateKey: 'plugin-eb-multiselect.tpl.html'
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
