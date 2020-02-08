import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule, MatInputModule, MatSelectModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './components/homepage/homepage.component';

import { StreamingService } from './services/streaming/streaming.service';

import { CustomString } from './pipes/customString.pipe';
import { CustomCurrentFolder } from './pipes/customCurrentFolder.pipe';
import { UploadFileComponent } from './components/upload-file/upload-file.component';
import { FileExplorerViewerComponent } from './components/file-explorer-viewer/file-explorer-viewer.component';
import { SearchMangasComponent } from './components/search-mangas/search-mangas.component';
import { ContentViewerComponent } from './components/content-viewer/content-viewer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    CustomString,
    CustomCurrentFolder,
    UploadFileComponent,
    FileExplorerViewerComponent,
    SearchMangasComponent,
    ContentViewerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatSliderModule,
    MatInputModule,
    MatSelectModule
  ],
  providers: [StreamingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
