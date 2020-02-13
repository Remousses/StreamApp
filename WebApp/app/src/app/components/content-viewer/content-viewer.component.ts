import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StreamingService } from 'src/app/services/streaming/streaming.service';
import { LoaderService } from 'src/app/services/loader/loader.service';

@Component({
  selector: 'app-content-viewer',
  templateUrl: './content-viewer.component.html',
  styleUrls: ['./content-viewer.component.scss']
})
export class ContentViewerComponent implements OnInit {
  @Input() link;
  @Input() imageJSON;
  @Input() currentFolder;
  @Input() imageLeft;
  @Input() imageRight;
  
  @Output() imageDataChange: EventEmitter<string> = new EventEmitter<string>();
  
  constructor(private streamingService: StreamingService, private loaderService: LoaderService) { }

  ngOnInit() {
  }

  getImage(imageSelected: string): void {
    this.loaderService.setSpinnerState(true);
    
    if(imageSelected){
      new Promise<any>((resolve, reject) => {
        this.streamingService.getImage(this.currentFolder + '/' + imageSelected).subscribe(res => {
          this.loaderService.setSpinnerState(false);
          resolve(res);
        }, err => {
          this.loaderService.setSpinnerState(false);
          reject(err);
        });
      }).then(res => {
        this.imageJSON = {
          name: imageSelected,
          base64: res.image
        };
        this.imageDataChange.emit(this.imageJSON);
      }).catch(err => console.log('Error from APIs', err));
    }
  }
}
