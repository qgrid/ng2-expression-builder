import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConditionBuilderComponent } from './condition-builder.component';
import { ConditionBuilderPipe } from './condition-builder.pipe';
import { EbModule } from '../expression-builder/eb.module';
import { TemplateModule } from '../template/template.module';

@NgModule({
    imports: [
        CommonModule,
        TemplateModule,
        EbModule
    ],
    exports: [
        ConditionBuilderComponent,
        ConditionBuilderPipe
    ],
    declarations: [
        ConditionBuilderComponent,
        ConditionBuilderPipe
    ]
})
export class ConditionBuilderModule {
}
