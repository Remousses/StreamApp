import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { StreamingService } from 'src/app/services/streaming/streaming.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-file-explorer-viewer',
  templateUrl: './file-explorer-viewer.component.html',
  styleUrls: ['./file-explorer-viewer.component.scss']
})
export class FileExplorerViewerComponent implements OnInit {
  @Input() currentFolder;
  @Input() link;
  @Input() image;
  @Output() currentFolderDataChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() linkDataChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() imageDataChange: EventEmitter<string> = new EventEmitter<string>();
  returnButtonVisible: boolean = false;
  list = [];

  constructor(private streamingService: StreamingService) { }

  ngOnInit() {
    this.getAllContent().then(res => {
      this.list = res.list;
    }).catch(err => console.log('Error from APIs', err));
  }

  historyBack() {
    this.setCurrentFolder(this.currentFolder.match(/(.*[\\\/])/)[0]);
    let checkLastCharacter = this.currentFolder.substr(0, this.currentFolder.length - 1);

    if (this.currentFolder.endsWith('/')) {
      this.setCurrentFolder(checkLastCharacter);
    }

    this.getAllContent(this.currentFolder).then(res => {
      this.list = res.list;
    }).catch(err => console.log('Error from APIs', err));
  }

  getAllContent(repo?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.streamingService.getAllContent(repo).subscribe(res => {
        resolve(res);
      }, err => {
        reject(err);
      });
    });
  }

  getContent(content: string) {
    let repo = this.currentFolder + '/' + content;
    this.setLink('');
    this.setImage('');

    if (!this.returnButtonVisible) {
      this.returnButtonVisible = true;
    }

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
        this.getAllContent(repo).then(res => {
          this.list = res.list;
          this.setCurrentFolder(res.path);
        }).catch(err => console.log('Error from APIs', err));
        break;
    }
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

  setCurrentFolder(value: string) {
    this.currentFolder = value;    
    this.currentFolderDataChange.emit(this.currentFolder)
  }

  setLink(value: string) {
    this.link = value;
    this.linkDataChange.emit(this.link)
  }

  setImage(value: string) {
    this.image = value;
    this.imageDataChange.emit(this.image)
  }
}
