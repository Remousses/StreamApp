import { Component, OnInit } from '@angular/core';
import { StreamService } from 'src/app/services/stream/stream.service';
import { FormBuilder, Validators } from '@angular/forms';

import { MatDialogRef } from '@angular/material';

import { LoaderService } from 'src/app/services/loader/loader.service';
import { UploadService } from 'src/app/services/upload/upload.service';

@Component({
  selector: 'app-new-file-dialog',
  templateUrl: './new-file-dialog.component.html',
  styleUrls: ['./new-file-dialog.component.scss']
})
export class NewFileDialogComponent implements OnInit {
  filesToUpload: [];
  uploadForm = this.formBuilder.group({
    files: [null, Validators.required]
  });

  constructor(private uploadService: UploadService,
              private formBuilder: FormBuilder,
              private loaderService: LoaderService,
              private dialogRef: MatDialogRef<NewFileDialogComponent>) { }

  ngOnInit() {
  }

  onFilesChange(event: any) {
    const eventFiles = event.target.files;
    
    if(eventFiles && eventFiles.length > 0){
      this.filesToUpload = eventFiles;
    }
    
    this.uploadForm.patchValue({
      files: eventFiles
    });
  }

  onSubmit() {
    this.loaderService.setSpinnerState(true);

    let formData: FormData = new FormData();
    formData.append('currentFolder', localStorage.getItem('currentFolder'));

    for(let file of this.filesToUpload){
      formData.append('files', file);
    };

    this.uploadService.upload(formData).subscribe(res => {
      this.loaderService.setSpinnerState(false);
      this.dialogRef.close();
    }, err => {
      this.dialogRef.close();
      this.loaderService.setSpinnerState(false);
      console.log(err);
    });
  }
}
