import { AppError } from '../infrastructure/error';
import { Command } from '../infrastructure/command';
import { Component, Output, EventEmitter, OnInit, Input, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, ApplicationRef } from '@angular/core';
import { ConditionBuilderModel } from './condition-builder.model';
import { EbNodeService } from '../expression-builder/eb-node.service';
import { IExpression } from './schema/expression';
import { INodeSchema } from '../expression-builder/model/node.schema';
import { Node } from '../expression-builder/model/node';
import { SerializationService, ISerializationNode } from '../expression-builder/serialization.service';
import { ThemeService } from '../theme/theme.service';
import { TraverseService } from '../expression-builder/traverse.service';
import { WhereSchema } from './schema/where.schema';
import { visit as convert } from './schema/converter';

@Component({
    selector: 'q-condition-builder',
    templateUrl: './condition-builder.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConditionBuilderComponent implements OnInit {
    private _model: ConditionBuilderModel;

    @Input() set model(value: ConditionBuilderModel) {
      this._model = value;
      this.cdr.detectChanges();
    }

    get model() {
      return this._model;
    }

    @Output() close = new EventEmitter<any>();

    root: Node;
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
            this.nodeService.currentChange.emit();

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
            this.nodeService.currentChange.emit();

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

            this.nodeService.currentChange.emit();
        },
        canExecute: () => {
            const current = this.nodeService.current;
            return current && (current.id === '#condition' || (current.level > 1 || current.children.length > 0));
        }
    });

    load = new Command<ISerializationNode, boolean>({
        execute: node => {
            this.cdr.markForCheck();

            const serializer = new SerializationService();
            this.root = serializer.deserialize(this.plan, node);
            this.nodeService.current = this.root.children[0];
            return true;
        },
        canExecute: node => !!node
    });

    save = new Command<any, { node: ISerializationNode, expression: IExpression }>({
        execute: () => {
            this.cdr.markForCheck();

            const serializer = new SerializationService();
            const node = serializer.serialize(this.root);
            const expression = convert(node);
            return {
                node,
                expression
            };
        },
        canExecute: () => {
            const depth = this.traverse.depth(this.root);
            return depth((memo, expression, line, node) =>
                node.attr('placeholder')
                    ? memo
                    : memo && expression.isValid()
                , true);
        }
    });

    reset = new Command({
        execute: () => {
            this.cdr.markForCheck();

            const schema = new WhereSchema(this.model);
            const plan = schema.factory();
            this.root = plan.apply();

            const root = this.root.children[0];
            root.clear();

            this.nodeService.current = this.root.children[0];
        }
    });

    constructor(
        private cdr: ChangeDetectorRef,
        private element: ElementRef,
        private nodeService: EbNodeService,
        private theme: ThemeService,
    ) {
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
        this.root = this.plan.apply();
        this.nodeService.current = this.root.children[0];
    }

    private findLogicalNode(node: Node) {
        return this.traverse.findUp(node, n => n.id === '#logical');
    }
}
