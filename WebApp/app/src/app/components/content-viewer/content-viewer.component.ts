import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { StreamService } from 'src/app/services/stream/stream.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { UploadService } from 'src/app/services/upload/upload.service';

@Component({
  selector: 'app-content-viewer',
  templateUrl: './content-viewer.component.html',
  styleUrls: ['./content-viewer.component.scss']
})
export class ContentViewerComponent implements OnInit {
  @Input() link;
  @Input() encodedJSON;
  @Input() currentFolder;
  @Input() dataLeft;
  @Input() dataRight;
  @Input() actualContent;

  @Output() encodedJSONDataChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() refreshView: EventEmitter<string> = new EventEmitter<string>();

  constructor(private domSanitizer: DomSanitizer,
              private streamService: StreamService,
              private loaderService: LoaderService,
              private uploadService: UploadService) { }

  ngOnInit() { }

  getNextBase64Data(dataSelected: string, type: string): void {
    this.loaderService.setSpinnerState(true);
console.log('getNextBase64Data', type);

    if (dataSelected) {
      // new Promise<any>((resolve, reject) => {
      this.streamService.getBase64Data(this.currentFolder + '/' + dataSelected, type).subscribe(res => {
        this.loaderService.setSpinnerState(false);
        this.encodedJSON = {
          type,
          name: dataSelected,
          base64: res.data,
          updateSlider: true
        };
        this.encodedJSONDataChange.emit(this.encodedJSON);
        // resolve(res);
      }, err => {
        this.loaderService.setSpinnerState(false);
        console.log('Error from API to get', type, err);
      });
    }
  }

  deleteFile() {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce fichier ?')) {
      this.uploadService.deleteFile(this.currentFolder, this.actualContent).subscribe(res => {
        this.loaderService.setSpinnerState(false);
        this.refreshView.emit();
      }, err => {
        this.loaderService.setSpinnerState(false);
        console.log('Error from API', err);
      });
    }
  }
}
