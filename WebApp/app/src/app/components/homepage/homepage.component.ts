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
  imageJSON: Object = {
    name: '',
    base64: ''
  };
  contentList: Array<string> = [];
  imageLeft: string = '';
  imageRight: string = '';
  allAllowedExtension = AllowedExtension;

  fileElements: Observable<FileElement[]>;
  currentRoot: FileElement;

  constructor(public loaderService: LoaderService) { }

  ngOnInit() {
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

    let imagesArray = this.contentList.filter(element => {
      element = element.toLocaleLowerCase();
      
      if(element.endsWith(this.allAllowedExtension.JPEG)
            || element.endsWith(this.allAllowedExtension.JPG)
            || element.endsWith(this.allAllowedExtension.PNG)) {
              return true;
      }
    });
                        
    imagesArray.forEach((element, key) => {
      if (value.name === element) {
        let less = key - 1;
        let more = key + 1;
        if (key === 0) {
          this.imageRight = imagesArray[more];
        } else if (key === imagesArray.length - 1) {
          this.imageLeft = imagesArray[less];
        } else {
          this.imageRight = imagesArray[more];
          this.imageLeft = imagesArray[less];
        }
      }
    });
  }
}
