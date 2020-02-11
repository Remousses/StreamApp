import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { StreamingService } from 'src/app/services/streaming/streaming.service';
import { environment } from 'src/environments/environment';

import { FileElement } from 'src/app/model/file-element';
import { MatDialog } from '@angular/material';
import { NewFolderDialogComponent } from 'src/app/modals/new-folder-dialog/new-folder-dialog.component';
import { RenameDialogComponent } from 'src/app/modals/rename-dialog/rename-dialog.component';
import { NewFileDialogComponent } from 'src/app/modals/new-file-dialog/new-file-dialog.component';

@Component({
  selector: 'app-file-explorer-viewer',
  templateUrl: './file-explorer-viewer.component.html',
  styleUrls: ['./file-explorer-viewer.component.scss']
})
export class FileExplorerViewerComponent implements OnInit {
  @Input() fileElements: FileElement[]
  @Input() path: string;
  @Input() currentFolder;
  @Input() link;
  @Input() image;
  list = [];

  @Output() currentFolderDataChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() linkDataChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() imageDataChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() folderAdded = new EventEmitter<{ name: string }>()
  @Output() elementRemoved = new EventEmitter<FileElement>()
  @Output() elementRenamed = new EventEmitter<FileElement>()

  constructor(private streamingService: StreamingService, public dialog: MatDialog) { }

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

  getContent(content: string) {
    let repo = this.currentFolder + '/' + content;

    let array = repo.split('/');
    
    if(array[array.length - 2] === content) {
      repo = this.currentFolder;
    }

    this.setLink('');
    this.setImage('');

    switch (content.split('.')[1]) {
      case 'jpg':
      case 'jpeg':
      case 'png':

        this.getImage(repo).then(res => {
          this.setImage(res.image);
        }).catch(err => console.log('Error from APIs', err));
        break;

      case 'mp3':
        this.setLink(environment.searchAudioUrl + '?name=' + content + '&path=' + repo);
        break;

      case 'mp4':
        this.setLink(environment.searchVideoUrl + '?name=' + content + '&path=' + repo);
        break;

      default:
        console.log("getContent");
        this.getAllContentByRepo(repo);
        break;
    }
  }

  private getAllContentByRepo(repo: string) {
    this.streamingService.getAllContent(repo).subscribe(res => {
      this.list = res.list;
      this.setCurrentFolder(res.path);
      this.setLocaleStorage();
    },
    err => console.log('Error from APIs', err));
  }

  getImage(repo: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.streamingService.getImage(repo).subscribe(res => {
        resolve(res);
      }, err => {
        reject(err);
      });
    });
  }

  private setCurrentFolder(value: string) {
    this.currentFolder = value;
    this.currentFolderDataChange.emit(value);
  }

  private setLink(value: string) {
    this.link = value;
    this.linkDataChange.emit(value);
  }

  private setImage(value: string) {
    this.image = value;
    this.imageDataChange.emit(value);
  }

  private setLocaleStorage(value?: boolean) {
    if (!localStorage.getItem('currentFolder')) {
      localStorage.setItem('currentFolder', this.currentFolder);
    } else {
        if(value){
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
