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
import { MobileService } from 'src/app/services/mobile/mobile.service';
import { AllowedExtension } from 'src/app/utils/allowedExtension';
import { AddLinksDialogComponent } from 'src/app/modals/add-links-dialog/add-links-dialog.component';

@Component({
  selector: 'app-file-explorer-viewer',
  templateUrl: './file-explorer-viewer.component.html',
  styleUrls: ['./file-explorer-viewer.component.scss']
})
export class FileExplorerViewerComponent implements OnInit {
  private regexFolder = /(.*[\\\/])/;
  link: string = '';
  currentFolder: string = '';
  currentContent: string = '';
  initRepo: string = common.initRepo;

  @Input() encodedJSON;
  @Input() contentList;

  @Output() encodedJSONDataChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() contentListDataChange: EventEmitter<string> = new EventEmitter<string>();

  constructor(private streamService: StreamService,
    private dialog: MatDialog,
    private loaderService: LoaderService,
    private uploadService: UploadService,
    public mobileService: MobileService) {
      this.currentFolder = this.initRepo;
    }

  ngOnInit() {
    this.getAllContentByRepo(localStorage.getItem('currentFolder') || this.currentFolder);
  }

  openNewFolderDialog() {
    this.openDialog(NewFolderDialogComponent);
  }

  openNewFilesDialog() {
    this.openDialog(NewFilesDialogComponent);
  }

  openLinksDialog() {
    this.openDialog(AddLinksDialogComponent);
  }

  openDownloadFolderDialog(): void {

  }

  openRenameDialog(element: FileElement) {
    // const dialogRef = this.dialog.open(RenameDialogComponent);
    // dialogRef.afterClosed().subscribe(res => {
    //   if (res) {
    //     element.name = res;
    //     // this.elementRenamed.emit(element);
    //   }
    // });
    this.openDialog(RenameDialogComponent);
  }

  private openDialog(name: any) {
    const dialogRef = this.dialog.open(name);
    dialogRef.afterClosed().subscribe(cancel => {
      if (cancel !== 'cancel') {
        this.getAllContentByRepo(this.currentFolder)
      }
    });
  }

  historyBack() {
    this.setCurrentFolder(this.currentFolder.match(this.regexFolder)[0]);
    const checkLastCharacter = this.currentFolder.substr(0, this.currentFolder.length - 1);

    if (this.currentFolder.endsWith('/')) {
      this.setCurrentFolder(checkLastCharacter);
    }

    this.getAllContentByRepo(this.currentFolder);
  }

  private getBase64Data(repo: string, type: string): Promise<any> {
    this.loaderService.setSpinnerState(true);

    return new Promise((resolve, reject) => {
      this.streamService.getBase64Data(repo, type).subscribe(res => {
        this.loaderService.setSpinnerState(false);
        resolve(res);
      }, err => {
        this.loaderService.setSpinnerState(false);
        reject(err);
      });
    });
  }

  private setBase64Data(name: string, base64: string, type: string, updateSlider: boolean) {
    this.encodedJSON = {
      type,
      name,
      base64,
      updateSlider
    };
    
    this.encodedJSONDataChange.emit(this.encodedJSON);
  }

  getContent(content: string, searchFile?: boolean) {
    let name: string, repo: string;
    const checkLocalStorage = content.split(':');
    
    if (searchFile) {
      const lastSlash = /[^/]*$/;
      name = lastSlash.exec(content)[0];
      repo = content;
    } else if(checkLocalStorage.length == 1) {
      name = content;
      repo = this.currentFolder + '/' + content;
    } else {
      checkLocalStorage.shift();
      const splitContent = checkLocalStorage.join('/').split('/');
      name = splitContent[splitContent.length - 1];
      repo = splitContent.join('/');
    }

    this.currentContent = '';
    this.link = '';
    this.setBase64Data('', '', '', false);
    
    switch (name.split('.')[1]) {
      case AllowedExtension.WEBP:
      case AllowedExtension.IMAGE.JPG:
      case AllowedExtension.IMAGE.JPEG:
      case AllowedExtension.IMAGE.PNG:
        this.getBase64Data(repo, 'image').then(res => {
          this.setBase64Data(name, res.data, 'image', true);
          this.currentContent = name;
          this.setLocaleStorage('CONTENT', res.data);
        }).catch(err => console.log('Error from APIs', err));
        break;

      case AllowedExtension.PDF:
        this.getBase64Data(repo, 'pdf').then(res => {
          this.setBase64Data(name, res.data, 'pdf', true);
          this.currentContent = name;
          this.setLocaleStorage('CONTENT', res.data);
        }).catch(err => console.log('Error from APIs', err));
        break;

      case AllowedExtension.MP3:
        this.link = environment.searchAudioUrl + '?name=' + name + '&path=' + repo;
        this.currentContent = name;
        this.setLocaleStorage('CONTENT', this.link);
        break;

      case AllowedExtension.MP4:
        this.link = environment.searchVideoUrl + '?name=' + name + '&path=' + repo;
        this.currentContent = name;
        this.setLocaleStorage('CONTENT', this.link);
        break;

      // case AllowedExtension.WEBP:
      //   this.link = environment.searchVideoUrl + '?name=' + name + '&path=' + repo;
      //   this.currentContent = name;
      //   this.setLocaleStorage('CONTENT', this.link);
      //   break;

      default:
        this.getAllContentByRepo(repo);
        break;
    }
  }

  getAllContentByRepo(repo: string) {
    this.loaderService.setSpinnerState(true);
    const cb = (res) => {
      this.contentList = res.list;
      this.contentListDataChange.emit(this.contentList);
      this.setCurrentFolder(res.path);
      this.setLocaleStorage('FOLDER');
      this.loaderService.setSpinnerState(false);
    }
    this.streamService.getAllContent(repo).subscribe(res => {
      cb(res);
    },
      err => {
        console.log('Error from APIs, reset for ', this.initRepo, err);
        this.streamService.getAllContent(this.initRepo).subscribe(res => {
          cb(res);
        },
          err => {
            this.loaderService.setSpinnerState(false);
            console.log('Error from API ', err)
          }
        );
      });
  }

  private setCurrentFolder(value: string) {
    this.currentFolder = value;
  }

  private setLocaleStorage(storage: string, data?: any) {
    switch (storage) {
      case 'FOLDER':
        if (!localStorage.getItem('currentFolder')) {
          localStorage.setItem('currentFolder', this.currentFolder);
        } else {
          localStorage.setItem('currentFolder', this.currentFolder);
          this.currentFolder = localStorage.getItem('currentFolder');
        }
        break;
      case 'CONTENT':
        const jsonContent = JSON.stringify({
          name: this.currentContent, data
        });
        if (!localStorage.getItem('currentContent')) {
          localStorage.setItem('currentContent', jsonContent);
        } else {
          localStorage.setItem('currentContent', jsonContent);
          this.currentContent = JSON.parse(localStorage.getItem('currentContent')).name;
        }
        break;
      default:
        break;
    }
  }

  deleteFolder() {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce dossier ?')) {
      this.uploadService.deleteFolder(this.currentFolder).subscribe(res => {
        if(res.folderDeleted) {
          this.historyBack();
        }
      }, err => {
        this.loaderService.setSpinnerState(false);
        console.log('Error from API', err);
      });
    }
  }
}
