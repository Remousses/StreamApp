import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { StreamingService } from 'src/app/services/streaming/streaming.service';
import { environment } from 'src/environments/environment';

import { FileElement } from 'src/app/model/file-element';
import { MatDialog } from '@angular/material';
import { NewFolderDialogComponent } from 'src/app/modals/new-folder-dialog/new-folder-dialog.component';
import { RenameDialogComponent } from 'src/app/modals/rename-dialog/rename-dialog.component';
import { NewFileDialogComponent } from 'src/app/modals/new-file-dialog/new-file-dialog.component';
import { LoaderService } from 'src/app/services/loader/loader.service';

@Component({
  selector: 'app-file-explorer-viewer',
  templateUrl: './file-explorer-viewer.component.html',
  styleUrls: ['./file-explorer-viewer.component.scss']
})
export class FileExplorerViewerComponent implements OnInit {
  link: string = '';
  currentFolder: string = 'Repositories';

  @Input() fileElements: FileElement[]
  @Input() path: string;
  @Input() imageJSON;
  @Input() contentList;

  @Output() imageDataChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() contentListDataChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() folderAdded = new EventEmitter<{ name: string }>()
  @Output() elementRemoved = new EventEmitter<FileElement>()
  @Output() elementRenamed = new EventEmitter<FileElement>()

  constructor(private streamingService: StreamingService, public dialog: MatDialog, private loaderService: LoaderService) { }

  ngOnInit() {
    this.getAllContentByRepo(localStorage.getItem('currentFolder') || this.currentFolder);
  }

  deleteElement(element: FileElement) {
    this.elementRemoved.emit(element);
  }

  openNewFolderDialog() {
    let dialogRef = this.dialog.open(NewFolderDialogComponent);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.folderAdded.emit({ name: res });
      }
    });
  }

  openNewFileDialog() {
    let dialogRef = this.dialog.open(NewFileDialogComponent);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.folderAdded.emit({ name: res });
      }
    });
  }

  openRenameDialog(element: FileElement) {
    let dialogRef = this.dialog.open(RenameDialogComponent);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        element.name = res;
        this.elementRenamed.emit(element);
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
      this.streamingService.getImage(repo).subscribe(res => {
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

    this.setLink('');
    this.setImage('', '');

    switch (content.split('.')[1]) {
      case 'jpg':
      case 'jpeg':
      case 'png':
        this.getImage(repo).then(res => {
          this.setImage(content, res.image);
        }).catch(err => console.log('Error from APIs', err));
        break;

      case 'mp3':
        this.setLink(environment.searchAudioUrl + '?name=' + content + '&path=' + repo);
        break;

      case 'mp4':
        this.setLink(environment.searchVideoUrl + '?name=' + content + '&path=' + repo);
        break;

      default:
        this.getAllContentByRepo(repo);
        break;
    }
  }

  getAllContentByRepo(repo: string) {
    this.loaderService.setSpinnerState(true);
    this.streamingService.getAllContent(repo).subscribe(res => {
      this.contentList = res.list;
      this.contentListDataChange.emit(this.contentList);
      this.setCurrentFolder(res.path);
      this.setLocaleStorage();
      this.loaderService.setSpinnerState(false);
    },
      err => {
        console.log('Error from APIs, reset by Repositories', err);
        this.streamingService.getAllContent('Repositories').subscribe(res => {
          this.contentList = res.list;
          this.contentListDataChange.emit(this.contentList);
          this.setCurrentFolder(res.path);
          this.setLocaleStorage();
          this.loaderService.setSpinnerState(false);
        },
          err => {
            this.loaderService.setSpinnerState(false);
            console.log('Error from APIs', err)
          }
      );
  });
}

  private setCurrentFolder(value: string) {
  this.currentFolder = value;
}

  private setLink(value: string) {
  this.link = value;
}

  private setImage(name: string, base64: string) {
  this.imageJSON = {
    name,
    base64
  };
  this.imageDataChange.emit(this.imageJSON);
}

  private setLocaleStorage(value ?: boolean) {
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
}
