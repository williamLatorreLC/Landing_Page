import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ChatComponent } from './components/chat/chat.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from "ngx-spinner";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgImageSliderModule } from 'ng-image-slider';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ListaCasosComponent } from './components/lista-casos/lista-casos.component';
import { RegistroFinalComponent } from './components/registro-final/registro-final.component';
import { RegistroResolutorComponent } from './components/registro-resolutor/registro-resolutor.component';
import { HeaderComponent } from './components/header/header.component';
import { PipeSearchPipe } from './pipes/pipe-search.pipe';
import { GtagModule } from './services/gtmServices/gtag.module';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ChatComponent,
    ListaCasosComponent,
    RegistroFinalComponent,
    RegistroResolutorComponent,
    HeaderComponent,
    PipeSearchPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
    BrowserAnimationsModule,
    NgImageSliderModule,
    NgbModule,
    GtagModule.init({
      targetId: 'UA-175402192-1'
    }),
    NgIdleKeepaliveModule.forRoot()
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
