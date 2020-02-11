import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common'
import {
  MatSliderModule, MatInputModule, MatSelectModule,
  MatIconModule, MatFormFieldModule, MatToolbarModule,
  MatGridListModule, MatMenuModule,
  MatDialogModule, MatButtonModule, MatCardModule
} from '@angular/material';

import { FlexLayoutModule } from "@angular/flex-layout";

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { CustomCurrentFolder } from './pipes/customCurrentFolder.pipe';
import { FileExplorerViewerComponent } from './components/file-explorer-viewer/file-explorer-viewer.component';
import { SearchMangasComponent } from './components/search-mangas/search-mangas.component';
import { ContentViewerComponent } from './components/content-viewer/content-viewer.component';
import { NewFolderDialogComponent } from './modals/new-folder-dialog/new-folder-dialog.component';
import { RenameDialogComponent } from './modals/rename-dialog/rename-dialog.component';

import { CustomString } from './pipes/customString.pipe';

import { StreamingService } from './services/streaming/streaming.service';
import { UploadFileService } from './services/upload-file/upload-file.service';
import { NewFileDialogComponent } from './modals/new-file-dialog/new-file-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    CustomString,
    CustomCurrentFolder,
    FileExplorerViewerComponent,
    SearchMangasComponent,
    ContentViewerComponent,
    NewFolderDialogComponent,
    RenameDialogComponent,
    NewFileDialogComponent
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
    MatSelectModule,
    MatIconModule,
    MatFormFieldModule,
    CommonModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatGridListModule,
    MatMenuModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule
  ],
  providers: [StreamingService, UploadFileService],
  entryComponents: [NewFolderDialogComponent, RenameDialogComponent, NewFileDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
