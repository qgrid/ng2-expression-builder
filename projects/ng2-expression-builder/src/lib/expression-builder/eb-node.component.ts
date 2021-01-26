import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Node } from './model/node';
import { EbNodeService } from './eb-node.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'q-eb-node',
    templateUrl: './eb-node.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EbNodeComponent implements OnInit, OnDestroy {
    @Input() model: Node;

    private sub = new Subscription();

    constructor(
        public service: EbNodeService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.subOnCurrentChange();
    }

    private subOnCurrentChange(): void {
        const sub = this.service.currentChange.subscribe(() => this.cdr.detectChanges());
        this.sub.add(sub);
    }

    select(e) {
        e.stopPropagation();

        if (this.model.parent) {
            this.service.current = this.model;
        }
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }
}
