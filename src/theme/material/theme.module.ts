import { NgModule, ComponentFactoryResolver } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeComponent } from './theme.component';
import { TemplateModule } from '../../template/template.module';
import { TemplateService } from '../../template/template.service';
import { ThemeService } from '../theme.service';
import {
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatTooltipModule,
    MatInputModule,
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
import { EbAutocompleteTplComponent } from './eb-autocomplete-tpl.component';
import { EbButtonTplComponent } from './eb-button-tpl.component';
import { EbIconButtonTplComponent } from './eb-icon-button-tpl.component';
import { EbInputTplComponent } from './eb-input-tpl.component';
import { EbLabelTplComponent } from './eb-label-tpl.component';
import { EbMultiselectTplComponent } from './eb-multiselect-tpl.component.1';
import { EbSelectTplComponent } from './eb-select-tpl.component';
import { TemplateCacheDirective } from '../../template/template-cache.directive';

@NgModule({
    declarations: [
        ThemeComponent,
        ConditionBuilderTplComponent,
        EbAutocompleteTplComponent,
        EbButtonTplComponent,
        EbIconButtonTplComponent,
        EbInputTplComponent,
        EbLabelTplComponent,
        EbMultiselectTplComponent,
        EbSelectTplComponent
    ],
    exports: [
        ThemeComponent,
        TemplateCacheDirective,
    ],
    imports: [
        CommonModule,

        FormsModule,

        TemplateModule,
        EbModule,
        ConditionBuilderModule,

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
