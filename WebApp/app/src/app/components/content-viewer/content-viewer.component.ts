import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() imageJSON;
  @Input() currentFolder;
  @Input() imageLeft;
  @Input() imageRight;
  @Input() actualContent;

  @Output() imageDataChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() refreshView: EventEmitter<string> = new EventEmitter<string>();

  constructor(private streamService: StreamService,
              private loaderService: LoaderService,
              private uploadService: UploadService) { }

  ngOnInit() {
  }

  getImage(imageSelected: string): void {
    this.loaderService.setSpinnerState(true);

    if (imageSelected) {
      // new Promise<any>((resolve, reject) => {
      this.streamService.getImage(this.currentFolder + '/' + imageSelected).subscribe(res => {
        this.loaderService.setSpinnerState(false);
        this.imageJSON = {
          name: imageSelected,
          base64: res.image
        };
        this.imageDataChange.emit(this.imageJSON);
        // resolve(res);
      }, err => {
        this.loaderService.setSpinnerState(false);
        console.log('Error from API', err);
        // reject(err);

      });
      // }).then(res => {

      // }).catch(err => );
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
