import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './components/homepage/homepage.component';

import { StreamingService } from './services/streaming/streaming.service';

import { CustomString } from './pipes/customString.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    CustomString
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [StreamingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
