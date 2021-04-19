import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { FileElement } from 'src/app/model/file-element';
import { LoaderService } from 'src/app/services/loader/loader.service';

import { AllowedExtension } from 'src/app/utils/allowedExtension';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  encodedJSON: Object = {
    type: '',
    name: '',
    base64: ''
  };
  contentList: Array<string> = [];
  dataLeft: string = '';
  dataRight: string = '';

  fileElements: Observable<FileElement[]>;
  currentRoot: FileElement;

  constructor(public loaderService: LoaderService) { }

  ngOnInit() { }

  changeContentList(value: Array<string>) {
    this.contentList = value;
  }

  changeEncodedJSON(value: { type: string, name: string, base64: string, updateSlider: boolean }) {
    this.encodedJSON = {
      type: value.type,
      name: value.name,
      base64: value.base64,
      updateSlider: value.updateSlider
    };

    if (value.updateSlider) {
      this.dataLeft = '';
      this.dataRight = '';
      
      let allAllowedExtensionArray;

      switch (value.type) {
        case 'image':
          allAllowedExtensionArray = [
            AllowedExtension.IMAGE.JPEG,
            AllowedExtension.IMAGE.JPG,
            AllowedExtension.IMAGE.PNG
          ];
          break;
        case AllowedExtension.PDF:
            allAllowedExtensionArray = [
              AllowedExtension.PDF
            ];
            break;
        default:
          break;
      }
      
      const array = this.contentList.filter(element => allAllowedExtensionArray.find(allowed => element.toLocaleLowerCase().endsWith(allowed)));
      
      array.forEach((element, key) => {
        if (value.name === element) {
          const less = key - 1;
          const more = key + 1;
          if (key === 0) {
            this.dataRight = array[more];
          } else if (key === array.length - 1) {
            this.dataLeft = array[less];
          } else {
            this.dataRight = array[more];
            this.dataLeft = array[less];
          }
        }
      });
    }
  }
}
