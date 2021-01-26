import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";

@Component({
    selector: 'q-condition-builder-tpl',
    templateUrl: 'condition-builder-tpl.component.html',
    styleUrls: ['./condition-builder-tpl.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConditionBuilderTplComponent {
}
