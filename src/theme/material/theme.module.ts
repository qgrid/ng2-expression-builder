import {
	NgModule,
	ComponentFactoryResolver,
	ApplicationRef,
	Injector
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeComponent } from './theme.component';
import { TemplateModule } from '../../template/template.module';
import { TemplateService } from '../../template/template.service';
import {ThemeService} from '../theme.service';
import {
	MatIconModule,
	MatButtonModule,
	MatSelectModule,
	MatTooltipModule,
	MatInputModule,
	MatFormFieldModule,
	MatDatepickerModule,
	MatChipsModule,
	MatAutocompleteModule,
	MatToolbarModule
} from '@angular/material';
import { TemplateLinkService } from '../../template/template-link.service';
import { TemplateCacheService } from '../../template/template-cache.service';
import { ConditionBuilderModule } from '../../condition-builder/condition-builder.module';
import { EbModule } from '../../expression-builder/eb.module';
import { ConditionBuilderTplComponent } from './condition-builder-tpl.component';

@NgModule({
	declarations: [
		ThemeComponent,
		ConditionBuilderTplComponent
	],
	exports: [
		ThemeComponent		
	],
	imports: [
		CommonModule,
		TemplateModule,
		EbModule,
		ConditionBuilderModule,
		FormsModule,
		MatIconModule,
		MatButtonModule,
		MatSelectModule,
		MatTooltipModule,
		MatInputModule,
		MatDatepickerModule,
		MatChipsModule,
		MatAutocompleteModule,
		MatToolbarModule,
	],
	providers: [
		ThemeService,
		TemplateService,
		TemplateLinkService,
		TemplateCacheService
	],
	entryComponents: [
		ThemeComponent
	]
})
export class ThemeModule {
	constructor(
		theme: ThemeService,
		componentResolver: ComponentFactoryResolver
	) {
		theme.name = 'material';
		theme.component = ThemeComponent;
	}
}
