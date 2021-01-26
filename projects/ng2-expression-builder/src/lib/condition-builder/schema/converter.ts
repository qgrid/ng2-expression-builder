import { AppError } from '../../infrastructure/error';
import { cloneDeep } from '../../infrastructure/utility';
import { ISerializationNode, ISerializationGroup, ISerializationExpression } from '../../expression-builder/serialization.service';
import { IExpression } from './expression';
import { camelCaseMapping as camelCase } from './operator';

export function visit(node: ISerializationNode): IExpression {
    switch (node.id) {
        case '#root':
            return visit(node.children[0]);
        case '#logical':
            const group = visitGroup(node);
            if (group) {
                if (!(group.left || group.right)) {
                    return null;
                }
            }

            return group;
        case '#condition':
            return visitCondition(node);
        default:
            throw new AppError('converter', `Invalid kind ${node.id}`);
    }
}

function visitGroup(node: ISerializationNode) {
    const line = node.line;
    const opExpr = find(line, '#logical-op', '#logical-op');
    const children = node.children.filter(notPlaceholder).map(visit);

    if (children.length === 0) {
        return null;
    }

    if (children.length === 1) {
        return {
            kind: 'group',
            op: opExpr.value.toLowerCase(),
            left: children[0],
            right: null
        };
    }

    return children
        .slice(1)
        .reduce((memo, item) => ({
            kind: 'group',
            op: opExpr.value.toLowerCase(),
            left: memo,
            right: item
        }), children[0]);
}

function visitCondition(node: ISerializationNode) {
    const line = node.line;
    const opExpr = find(line, '#operator', '#operator');
    const value = opExpr.value.toUpperCase();

    let condition;
    switch (value) {
        case 'IS NOT EMPTY':
        case 'IS EMPTY':
            condition = visitUnary(line, opExpr.value);
            break;
        case 'EQUALS':
        case 'NOT EQUALS':
        case 'GREATER OR EQ. TO':
        case 'GREATER THAN':
        case 'LESS OR EQ. TO':
        case 'LESS THAN':
        case 'LIKE':
        case 'NOT LIKE':
        case 'STARTS WITH':
        case 'ENDS WITH':
            condition = visitBinary(line, opExpr.value);
            break;
        case 'BETWEEN':
            condition = visitBetween(line);
            break;
        case 'IN':
            condition = visitIn(line);
            break;
        default:
            throw new AppError('converter', `Invalid operation ${value}`);
    }

    condition.kind = 'condition';
    return condition;
}

function visitUnary(line, op: string) {
    const left = visitField(line);

    return {
        left: left.value,
        op: camelCase[op.toUpperCase()]
    };
}

function visitBinary(line, op: string) {
    const left = visitField(line);
    const right = find(line, '#operand', '#value') || find(line, '#fieldRight');

    return {
        left: left.value,
        op: camelCase[op.toUpperCase()],
        right: right.value
    };
}

function visitIn(line: ISerializationGroup[]) {
    const left = visitField(line);
    const right = find(line, '#operand', '#in-operand') || find(line, '#fieldRight');

    return {
        left: left.value,
        op: 'in',
        right: cloneDeep(right.values) || right.value
    };
}

function visitBetween(line: ISerializationGroup[]) {
    const left = visitField(line);
    const from = find(line, '#operand', '#from') || find(line, '#fieldFrom');
    const to = find(line, '#operand', '#to') || find(line, '#fieldTo');

    return {
        left: left.value,
        op: 'between',
        right: [from.value, to.value]
    };
}

function visitField(line: ISerializationGroup[]) {
    return find(line, '#field') || find(line, '#fieldLeft');
}

function notPlaceholder(node: ISerializationNode) {
    return !node.attributes.placeholder;
}

function find(line: ISerializationGroup[], groupId: string, exprId?: string) {
    const group = findById(line, groupId);
    if (!group) {
        return null;
    }

    return findById(group.expressions, exprId || groupId);
}

function findById(items: ISerializationGroup[] | ISerializationExpression[], id: string) {
    const result = (items as any).filter(item => item.id === id);
    const length = result.length;

    if (length === 1) {
        return result[0];
    }

    if (length > 1) {
        throw new AppError('converter', `Ambiguous id ${id}`);
    }

    return null;
}
