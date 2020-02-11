import { Component, OnInit } from '@angular/core';
import { StreamingService } from 'src/app/services/streaming/streaming.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-file-dialog',
  templateUrl: './new-file-dialog.component.html',
  styleUrls: ['./new-file-dialog.component.scss']
})
export class NewFileDialogComponent implements OnInit {
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
