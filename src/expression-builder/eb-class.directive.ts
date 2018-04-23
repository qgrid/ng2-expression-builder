import { Directive, ElementRef, OnInit, Input, DoCheck, Optional } from '@angular/core';
import { isArray } from '../infrastructure/utility';
import { evaluateFactory } from './digest/evaluate';
import { EbNodeComponent } from './eb-node.component';

@Directive({
	selector: '[q-eb-class]'
})
export class EbClassDirective implements OnInit, DoCheck {
	@Input('q-eb-class') klass: any;
	@Input('q-eb-class-model') model: any;

	private evaluate: (value: any) => any;
	private oldClassList: Array<string> = [];

	constructor(private element: ElementRef, @Optional() private node: EbNodeComponent) {
	}

	ngOnInit() {
		this.evaluate = evaluateFactory(this.model, [this.node ? this.node.model : null]);
	}

	ngDoCheck() {
		const result = this.evaluate(this.klass);
		if (result) {
			const classList = this.fetchClasses(result);
			if (this.oldClassList.length !== classList.length
				|| this.oldClassList.join(' ') !== classList.join(' ')) {

				const element = this.element.nativeElement as HTMLElement;
				element.classList.remove(...this.oldClassList);
				element.classList.add(...classList);
				this.oldClassList = classList;
			}
		} else if (this.oldClassList.length) {
			const element = this.element.nativeElement as HTMLElement;
			element.classList.remove(...this.oldClassList);
			this.oldClassList = [];
		}
	}

	private fetchClasses(meta) {
		if (isArray(meta)) {
			return meta;
		}

		const keys = Object.keys(meta);
		const classList = [];
		for (let i = 0, length = keys.length; i < length; i++) {
			const key = keys[i];
			if (meta[key]) {
				classList.push(key);
			}
		}

		return classList;
	}
}
