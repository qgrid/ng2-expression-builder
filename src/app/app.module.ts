import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core';
import { MatButtonModule, MatFormFieldModule, MatOptionModule, MatSelectModule } from '@angular/material';

import { AppComponent } from './app.component';
import { ThemeModule, ConditionBuilderModule } from '../public-api';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,

    ConditionBuilderModule,
    ThemeModule,

    MatFormFieldModule,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
