import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { StreamingService } from '../../services/streaming/streaming.service';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {
  uploadFileName: string = '';
  uploadForm = this.formBuilder.group({
    file: [null, Validators.required]
  });

  constructor(private streamingService: StreamingService, private formBuilder: FormBuilder) { }

  ngOnInit() {
  }

  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      this.uploadFileName = event.target.files[0].name;
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.uploadForm.patchValue({
          file: reader.result
        });
      };
    }
  }

  onSubmit() {
    this.streamingService.upload(this.uploadFileName, this.uploadForm.get('file').value).subscribe(res => {
      console.log("onSubmit", res);
    }, err => {
      console.log(err);
    });
  }
}
