import { Component, OnInit, Input } from '@angular/core';

import { StreamingService } from '../../services/streaming/streaming.service';

import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  currentFolder: string = 'Repositories';
  link: string = '';
  image: string = '';
  
  constructor(private streamingService: StreamingService) { }

  ngOnInit() {
    
  }

  changeCurrentFolder(value: string){
    this.currentFolder = value;
  }

  changeLink(value: string){
    this.link = value;
  }

  changeImage(value: string){
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
