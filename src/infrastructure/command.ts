import { yes } from './utility';

export class ICommandContext {
    execute?: (...args) => any;
    canExecute?: (...args) => boolean;
}

export class Command {
    execute = yes;
    canExecute = yes;

    constructor(context: ICommandContext = {}) {
        Object.assign(this, context);
    }
}