import { NgModule } from '@angular/core';
import { TemplateModule } from '../template/template.module';
import { ConditionBuilderComponent } from './condition-builder.component';
import { ConditionBuilderPipe } from './condition-builder.pipe';

@NgModule({
	imports: [
		TemplateModule
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
