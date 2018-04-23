import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ConditionBuilderModule } from '../condition-builder/condition-builder.module';

@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    ConditionBuilderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
