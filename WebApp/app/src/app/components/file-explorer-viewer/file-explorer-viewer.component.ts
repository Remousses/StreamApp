import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { StreamService } from 'src/app/services/stream/stream.service';
import { environment } from 'src/environments/environment';
import { common } from 'src/app/utils/common';

import { FileElement } from 'src/app/model/file-element';
import { MatDialog } from '@angular/material';
import { NewFolderDialogComponent } from 'src/app/modals/new-folder-dialog/new-folder-dialog.component';
import { RenameDialogComponent } from 'src/app/modals/rename-dialog/rename-dialog.component';
import { NewFilesDialogComponent } from 'src/app/modals/new-files-dialog/new-files-dialog.component';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { UploadService } from 'src/app/services/upload/upload.service';

@Component({
  selector: 'app-file-explorer-viewer',
  templateUrl: './file-explorer-viewer.component.html',
  styleUrls: ['./file-explorer-viewer.component.scss']
})
export class FileExplorerViewerComponent implements OnInit {
  link: string = '';
  currentFolder: string = '';
  actualContent: string = '';
  initRepo: string = common.initRepo;

  @Input() imageJSON;
  @Input() contentList;

  @Output() imageDataChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() contentListDataChange: EventEmitter<string> = new EventEmitter<string>();

  constructor(private streamService: StreamService,
    private dialog: MatDialog,
    private loaderService: LoaderService,
    private uploadService: UploadService) {
      this.currentFolder = this.initRepo;
    }

  ngOnInit() {
    this.getAllContentByRepo(localStorage.getItem('currentFolder') || this.currentFolder);
  }

  openNewFolderDialog() {
    let dialogRef = this.dialog.open(NewFolderDialogComponent);
    dialogRef.afterClosed().subscribe(() => this.getAllContentByRepo(this.currentFolder));
  }

  openNewFilesDialog() {
    let dialogRef = this.dialog.open(NewFilesDialogComponent);
    dialogRef.afterClosed().subscribe(() => this.getAllContentByRepo(this.currentFolder));
  }

  openRenameDialog(element: FileElement) {
    let dialogRef = this.dialog.open(RenameDialogComponent);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        element.name = res;
        // this.elementRenamed.emit(element);
      }
    });
  }

  historyBack() {
    this.setCurrentFolder(this.currentFolder.match(/(.*[\\\/])/)[0]);
    let checkLastCharacter = this.currentFolder.substr(0, this.currentFolder.length - 1);

    if (this.currentFolder.endsWith('/')) {
      this.setCurrentFolder(checkLastCharacter);
    }

    this.getAllContentByRepo(this.currentFolder);
  }

  private getImage(repo: string): Promise<any> {
    this.loaderService.setSpinnerState(true);

    return new Promise((resolve, reject) => {
      this.streamService.getImage(repo).subscribe(res => {
        this.loaderService.setSpinnerState(false);
        resolve(res);
      }, err => {
        this.loaderService.setSpinnerState(false);
        reject(err);
      });
    });
  }

  getContent(content: string) {
    let repo = this.currentFolder + '/' + content;
    this.actualContent = '';
    this.link = '';
    this.setImage('', '');

    switch (content.split('.')[1]) {
      case 'jpg':
      case 'jpeg':
      case 'png':
        this.getImage(repo).then(res => {
          this.setImage(content, res.image);
          this.actualContent = content;
        }).catch(err => console.log('Error from APIs', err));
        break;

      case 'mp3':
        this.link = environment.searchAudioUrl + '?name=' + content + '&path=' + repo;
        this.actualContent = content;
        break;

      case 'mp4':
        this.link = environment.searchVideoUrl + '?name=' + content + '&path=' + repo;
        this.actualContent = content;
        break;

      default:
        this.getAllContentByRepo(repo);
        break;
    }
  }

  getAllContentByRepo(repo: string) {
    this.loaderService.setSpinnerState(true);
    this.streamService.getAllContent(repo).subscribe(res => {
      this.contentList = res.list;
      this.contentListDataChange.emit(this.contentList);
      this.setCurrentFolder(res.path);
      this.setLocaleStorage();
      this.loaderService.setSpinnerState(false);
    },
      err => {
        console.log('Error from APIs, reset by', this.initRepo, err);
        this.streamService.getAllContent(this.initRepo).subscribe(res => {
          this.contentList = res.list;
          this.contentListDataChange.emit(this.contentList);
          this.setCurrentFolder(res.path);
          this.setLocaleStorage();
          this.loaderService.setSpinnerState(false);
        },
          err => {
            this.loaderService.setSpinnerState(false);
            console.log('Error from API', err)
          }
        );
      });
  }

  private setCurrentFolder(value: string) {
    this.currentFolder = value;
  }

  private setImage(name: string, base64: string) {
    this.imageJSON = {
      name,
      base64
    };
    this.imageDataChange.emit(this.imageJSON);
  }

  private setLocaleStorage(value?: boolean) {
    if (!localStorage.getItem('currentFolder')) {
      localStorage.setItem('currentFolder', this.currentFolder);
    } else {
      if (value) {
        this.currentFolder = localStorage.getItem('currentFolder');
        localStorage.setItem('currentFolder', this.currentFolder);
        this.getAllContentByRepo(localStorage.getItem('currentFolder'));
      } else {
        localStorage.setItem('currentFolder', this.currentFolder);
        this.currentFolder = localStorage.getItem('currentFolder');
      }
    }
  }

  deleteFolder() {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce dossier ?')) {
      this.uploadService.deleteFolder(this.currentFolder).subscribe(res => {
        if(res.folderDeleted) {
          this.loaderService.setSpinnerState(false);
          this.getAllContentByRepo(this.currentFolder.match(/(.*[\\\/])/)[0].slice(0, -1));
        }
      }, err => {
        this.loaderService.setSpinnerState(false);
        console.log('Error from API', err);
      });
    }
  }
}
