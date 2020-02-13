import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { FileElement } from 'src/app/model/file-element';
import { UploadFileService } from 'src/app/services/upload-file/upload-file.service';
import { StreamingService } from 'src/app/services/streaming/streaming.service';
import { LoaderService } from 'src/app/services/loader/loader.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  imageJSON: Object = {
    name: '',
    base64: ''
  };
  contentList: Array<string> = [];
  imageLeft: string = '';
  imageRight: string = '';

  fileElements: Observable<FileElement[]>;
  currentRoot: FileElement;

  constructor(private uploadFileService: UploadFileService, public loaderService: LoaderService) { }

  ngOnInit() {
  }

  addFolder(folder: { name: string }) {
    let element: FileElement = {
      isFolder: true,
      name: folder.name,
      parent: this.currentRoot ? this.currentRoot.id : 'root'
    };
    this.uploadFileService.add(element);
    this.updateFileElementQuery();
  }

  removeElement(element: FileElement) {
    this.uploadFileService.delete(element.id);
    this.updateFileElementQuery();
  }

  renameElement(element: FileElement) {
    this.uploadFileService.update(element.id, { name: element.name });
    this.updateFileElementQuery();
  }

  updateFileElementQuery() {
    this.fileElements = this.uploadFileService.queryInFolder(this.currentRoot ? this.currentRoot.id : 'root');
  }

  navigateToFolder(element: FileElement) {
    this.currentRoot = element;
    this.updateFileElementQuery();
  }

  changeContentList(value: Array<string>) {
    this.contentList = value;
  }

  changeImage(value: { name: string, base64: string }) {
    this.imageJSON = {
      name: value.name,
      base64: value.base64
    };
    this.imageLeft = '';
    this.imageRight = '';

    this.contentList.forEach((element, key) => {
      if (value.name === element) {
        let less = key - 1;
        let more = key + 1;
        if (key === 0) {
          this.imageRight = this.contentList[more];
        } else if (key === this.contentList.length - 1) {
          this.imageLeft = (this.contentList[less]);
        } else {
          this.imageRight = this.contentList[more];
          this.imageLeft = this.contentList[less];
        }
      }
    });
  }

  // upload(fileName: string, fileContent: string): void {
  //   this.streamingService.upload(fileName, fileContent).subscribe(res => {

  //     // console.log('Execution du skipt shell en cours');
  //     // Faire un refresh 
  //   }, err => {
  //     console.log(err);
  //   });


  //   .subscribe(res  => {
  //     this.fileList.push(fileName);
  //     this.fileList$.next(this.fileList);
  //   });
  // }

  // public remove(fileName): void {
  //   this.streamingService.http.delete('/files/${fileName}').subscribe(() => {
  //     this.fileList.splice(this.fileList.findIndex(name => name === fileName), 1);
  //     this.fileList$.next(this.fileList);
  //   });
  // }
}
