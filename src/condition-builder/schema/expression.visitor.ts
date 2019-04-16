import { AppError } from '../../infrastructure/error';
import { IExpression } from './expression';

export class Visitor {
    visit(item: IExpression, depth = 0) {
        switch (item.kind) {
            case 'group':
                return this.visitGroup(item, depth + 1);
            case 'condition':
                return this.visitCondition(item, depth);
            case 'function':
                return this.visitFunction(item, depth);
            default:
                throw new AppError(
                    'expression.visitor',
                    `Invalid kind ${item.kind}`
                );
        }
    }

    visitGroup(group: IExpression, depth: number) {
        if (group.right) {
            this.visit(group.left, depth);
            this.visit(group.right, depth);
        }

        return this.visit(group.left, depth);
    }

    visitCondition(condition: IExpression, depth: number) {
        switch (condition.op) {
            case 'isNotNull':
            case 'isNull':
            case 'isNotEmpty':
            case 'isEmpty':
            case 'isNumeric':
            case 'isNotNumeric':
                return this.visitUnary(condition, depth);
            case 'equals':
            case 'notEquals':
            case 'greaterThanOrEquals':
            case 'greaterThan':
            case 'lessThanOrEquals':
            case 'lessThan':
            case 'like':
            case 'notLike':
            case 'startsWith':
            case 'endsWith':
            case 'match':
                return this.visitBinary(condition, depth);
            case 'between':
                return this.visitBetween(condition, depth);
            case 'in':
                return this.visitIn(condition, depth);
            default:
                throw new AppError(
                    'expression.visitor',
                    `Invalid operation ${condition.op}`
                );
        }
    }

    visitUnary(condition: IExpression, depth: number) {
        this.visitLeft(condition.left, depth);
    }

    visitBinary(condition: IExpression, depth: number) {
        this.visitLeft(condition.left, depth);
        this.visitRight(condition.right, depth);
    }

    visitLeft(left: IExpression, depth: number) {
        if (left.kind) {
            switch (left.kind) {
                case 'function':
                    this.visitArguments(left.arguments, depth);
            }
        }
    }

    visitRight(left: IExpression, depth: number) {
    }

    visitBetween(condition: IExpression, depth: number) {
    }

    visitIn(condition: IExpression, depth: number) {
    }

    visitFunction(fn: IExpression, depth: number) {
    }

    visitArguments(args: Array<IExpression>, depth: number) {
        return args.map(arg => {
            switch (arg.kind) {
                case 'condition':
                case 'group':
                    this.visit(arg);
            }
        });
    }
}
