export interface IExpression {
    kind: string;
    op: string;
    left: IExpression | any;
    right: IExpression | any;
    arguments?: IExpression[];
}
