import { NgModule } from '@angular/core';
import { ConditionBuilderComponent } from './condition-builder.component';
import { ConditionBuilderPipe } from './condition-builder.pipe';
import { EbModule } from '../expression-builder/eb.module';
import { ThemeModule } from '../theme/material/theme.module';
import { TemplateModule } from '../template/template.module';

@NgModule({
	imports: [
		ThemeModule,
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
