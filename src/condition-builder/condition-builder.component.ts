import { Component, Optional, Output, EventEmitter, OnInit, ViewEncapsulation, Input, ElementRef } from '@angular/core';
import { Command } from '../infrastructure/command';
import { clone } from '../infrastructure/utility';
import { ConditionBuilderService } from './condition-builder.service';
import { WhereSchema } from './schema/where.schema';
import { visit as convert } from './schema/converter';
import { SerializationService, ISerializationNode } from '../expression-builder/serialization.service';
import { INodeSchema } from '../expression-builder/model/node.schema';
import { Node } from '../expression-builder/model/node';
import { EbNodeService } from '../expression-builder/eb-node.service';
import { EbNodeComponent } from '../expression-builder/eb-node.component';
import { TraverseService } from '../expression-builder/traverse.service';
import { ConditionBuilderModel } from './condition-builder.model';
import { AppError } from '../infrastructure/error';
import { ThemeService } from '../theme/theme.service';
import { IExpression } from './schema/expression';

@Component({
	selector: 'q-condition-builder',
	templateUrl: './condition-builder.component.html'
})
export class ConditionBuilderComponent implements OnInit {
	@Input() model: ConditionBuilderModel;
	@Output() close = new EventEmitter<any>();

	node: Node;
	themeComponent: any;
	$implicit = this;

	private traverse = new TraverseService();
	private plan: INodeSchema;

	addGroup = new Command({
		execute: () => {
			const current = this.nodeService.current;
			const parent = this.findLogicalNode(current);
			const group = parent.clone();
			parent.addChildAfter(group, current.id === '#condition' && current);
			if (current.id === '#condition') {
				this.nodeService.current = group;
			}
		},
		canExecute: () => !!this.findLogicalNode(this.nodeService.current)
	});

	addRule = new Command({
		execute: () => {
			const current = this.nodeService.current;
			const parent = this.findLogicalNode(current);
			const rule = this.plan.materialize('#condition');
			parent.addChildAfter(rule, current.id === '#condition' && current);
			if (current.id === '#condition') {
				this.nodeService.current = rule;
			}
		},
		canExecute: () => !!this.findLogicalNode(this.nodeService.current)
	});

	remove = new Command({
		execute: () => {
			const current = this.nodeService.current;
			if (current.id === '#logical' && current.level === 1) {
				current.clear();
			} else {
				const previous = this.traverse.findUpSibling(current);
				this.nodeService.current = previous;
				current.remove();
			}
		},
		canExecute: () => {
			const current = this.nodeService.current;
			return current && (current.id === '#condition' || (current.level > 1 || current.children.length > 0));
		}
	});

	load = new Command<ISerializationNode, boolean>({
		execute: node => {
			const serializer = new SerializationService();
			this.node = serializer.deserialize(this.plan, node);
			this.nodeService.current = this.node.children[0];
			return true;
		},
		canExecute: node => !!node
	});

	save = new Command<any, { node: ISerializationNode, expression: IExpression }>({
		execute: () => {
			const serializer = new SerializationService();
			const node = serializer.serialize(this.node);
			const expression = convert(node);
			return {
				node,
				expression
			};
		},
		canExecute: () => {
			const depth = this.traverse.depth(this.node);
			return depth((memo, expression, line, node) =>
				node.attr('placeholder')
					? memo
					: memo && expression.isValid()
				, true);
		}
	});

	reset = new Command({
		execute: () => {
			const schema = new WhereSchema(this.model);
			const plan = schema.factory();
			this.node = plan.apply();

			const root = this.node.children[0];
			root.clear();

			this.nodeService.current = this.node.children[0];
		}
	});

	constructor(
		private element: ElementRef,
		private nodeService: EbNodeService,
		private theme: ThemeService) {

		this.initTheme();
	}

	initTheme() {
		const theme = this.theme;
		if (!theme.component) {
			throw new AppError(
				'consition-builder.component',
				'Ensure that condition-builder theme module was included'
			);
		}

		this.themeComponent = theme.component;
		const element = this.element.nativeElement;

		this.theme.changed.subscribe(e => {
			if (e) {
				element.classList.remove(`q-condition-builder-theme-${e.oldValue}`);
			}

			element.classList.add(`q-condition-builder-theme-${e.newValue}`);
		});
	}

	ngOnInit() {
		if (!this.model) {
			throw new AppError('condition-builder.component', 'Model is not set');
		}

		const schema = new WhereSchema(this.model);
		this.plan = schema.factory() as any;
		this.node = this.plan.apply();
		this.nodeService.current = this.node.children[0];
	}

	private findLogicalNode(node: Node) {
		return this.traverse.findUp(node, n => n.id === '#logical');
	}
}
