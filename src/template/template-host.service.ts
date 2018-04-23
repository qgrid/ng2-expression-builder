import { Injectable } from '@angular/core';
import { identity } from '../infrastructure/utility';

@Injectable()
export class TemplateHostService {
	public key: (x: string) => string = identity;

	constructor() {
	}
}
