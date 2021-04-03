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
  @Output() refreshFileExplorerView: EventEmitter<string> = new EventEmitter<string>();
  @Output() retrieveDataFromLocalStorage: EventEmitter<string> = new EventEmitter<string>();

  constructor(public domSanitizer: DomSanitizer,
              private streamService: StreamService,
              private loaderService: LoaderService,
              private uploadService: UploadService) { }

  ngOnInit() {
    this.getDataFromLocalStorage();
  }

  private getDataFromLocalStorage(){
    const content = JSON.parse(localStorage.getItem('actualContent'));
    this.retrieveDataFromLocalStorage.emit(content.name);
  }

  getNextBase64Data(dataSelected: string, type: string): void {
    this.loaderService.setSpinnerState(true);

    if (dataSelected) {
      this.streamService.getBase64Data(this.currentFolder + '/' + dataSelected, type).subscribe(res => {
        this.actualContent = dataSelected;
        this.loaderService.setSpinnerState(false);
        this.refreshContentView(type, dataSelected, res.data, true);
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
        this.actualContent = '';
        this.refreshContentView('', '', '', false);
        this.refreshFileExplorerView.emit();
      }, err => {
        this.loaderService.setSpinnerState(false);
        console.log('Error from API', err);
      });
    }
  }

  private refreshContentView(type: string, name: string, base64: string, updateSlider: boolean) {
    this.encodedJSON = { type, name, base64, updateSlider };
    this.encodedJSONDataChange.emit(this.encodedJSON);
  }
}
