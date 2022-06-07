import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { MarkerService } from './marker.service';


import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { PopupService } from './popup.service';
import { LayerService } from './layer.service';
import { HeaderInterceptor } from './interceptor.service'


@NgModule({
  declarations: [
    AppComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [MarkerService,PopupService,LayerService,{  
    provide: HTTP_INTERCEPTORS,  
    useClass: HeaderInterceptor,  
    multi: true  
  }  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
