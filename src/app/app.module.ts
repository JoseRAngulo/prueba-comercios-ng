import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from './app-material/app-material/app-material.module';
import { AddBusinessComponent } from './components/agregar/add-business/add-business.component';
import { HomeComponent } from './components/home/home.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ViewModeDirective } from './directives/view-mode.directive';
import { EditModeDirective } from './directives/edit-mode.directive';
import { EditableComponent } from './components/editable/editable.component';
import { EditableOnEnterDirective } from './directives/editable-on-enter.directive';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  declarations: [
    AppComponent,
    AddBusinessComponent,
    HomeComponent,
    ViewModeDirective,
    EditModeDirective,
    EditableComponent,
    EditableOnEnterDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    FlexLayoutModule
  ],
  entryComponents: [AddBusinessComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
