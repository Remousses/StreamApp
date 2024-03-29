import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common'
import {
  MatSliderModule, MatInputModule, MatSelectModule,
  MatIconModule, MatFormFieldModule, MatToolbarModule,
  MatGridListModule, MatMenuModule,
  MatDialogModule, MatButtonModule, MatCardModule,
  MatProgressSpinnerModule, MatTooltipModule,
  MatListModule
} from '@angular/material';
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomepageComponent } from './components/homepage/homepage.component';
import { FileExplorerViewerComponent } from './components/file-explorer-viewer/file-explorer-viewer.component';
import { SearchMangasComponent } from './components/search-mangas/search-mangas.component';
import { ContentViewerComponent } from './components/content-viewer/content-viewer.component';

import { NewFolderDialogComponent } from './modals/new-folder-dialog/new-folder-dialog.component';
import { RenameDialogComponent } from './modals/rename-dialog/rename-dialog.component';
import { NewFilesDialogComponent } from './modals/new-files-dialog/new-files-dialog.component';
import { AddLinksDialogComponent } from './modals/add-links-dialog/add-links-dialog.component';
import { SearchFileDialogComponent } from './modals/search-file-dialog/search-file-dialog.component';

import { CustomCurrentFolder } from './pipes/customCurrentFolder.pipe';
import { CustomStringThreeDots } from './pipes/customStringThreeDots.pipe';

import { StreamService } from './services/stream/stream.service';
import { UploadService } from './services/upload/upload.service';
import { LoaderService } from './services/loader/loader.service';
import { SearchFileComponent } from './components/search-file/search-file.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    CustomCurrentFolder,
    CustomStringThreeDots,
    FileExplorerViewerComponent,
    SearchMangasComponent,
    ContentViewerComponent,
    NewFolderDialogComponent,
    RenameDialogComponent,
    NewFilesDialogComponent,
    AddLinksDialogComponent,
    SearchFileComponent,
    SearchFileDialogComponent
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
    MatProgressSpinnerModule,
    CommonModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatGridListModule,
    MatMenuModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    MatListModule
  ],
  providers: [StreamService, UploadService, LoaderService],
  entryComponents: [NewFolderDialogComponent, RenameDialogComponent, NewFilesDialogComponent, AddLinksDialogComponent, SearchFileDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
