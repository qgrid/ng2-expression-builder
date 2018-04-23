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

@NgModule({
	declarations: [
		ThemeComponent
	],
	exports: [
		ThemeComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		TemplateModule,
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
