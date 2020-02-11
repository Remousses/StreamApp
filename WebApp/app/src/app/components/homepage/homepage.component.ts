import { Component, OnInit, Input } from '@angular/core';

import { StreamingService } from '../../services/streaming/streaming.service';

import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileElement } from 'src/app/model/file-element';
import { UploadFileService } from 'src/app/services/upload-file/upload-file.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  currentFolder: string = 'Repositories';
  link: string = '';
  image: string = '';

  fileElements: Observable<FileElement[]>;
  currentRoot: FileElement;

  constructor(private streamingService: StreamingService, private uploadFileService: UploadFileService) { }

  ngOnInit() {

  }

  addFolder(folder: { name: string }) {
    this.uploadFileService.add({ isFolder: true, name: folder.name, parent: this.currentRoot ? this.currentRoot.id : 'root' });
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
    // this.currentFolder = this.pushToPath(this.currentFolder, element.name);
  }

  changeCurrentFolder(value: string) {
    this.currentFolder = value;
  }

  changeLink(value: string) {
    this.link = value;
  }

  changeImage(value: string) {
    this.image = value;
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
