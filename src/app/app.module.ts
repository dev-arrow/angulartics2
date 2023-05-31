import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LogosModule } from './logos/logos.module';
import { ProvidersComponent } from './providers/providers.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ProvidersComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,

    NgbCollapseModule.forRoot(),
    MatIconModule,

    LogosModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
