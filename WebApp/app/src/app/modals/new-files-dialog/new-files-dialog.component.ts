import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { MatDialogRef } from '@angular/material';

import { LoaderService } from 'src/app/services/loader/loader.service';
import { UploadService } from 'src/app/services/upload/upload.service';

@Component({
  selector: 'app-new-files-dialog',
  templateUrl: './new-files-dialog.component.html',
  styleUrls: ['./new-files-dialog.component.scss']
})
export class NewFilesDialogComponent implements OnInit {
  filesToUpload: [];
  uploadFilesForm = this.formBuilder.group({
    files: [null, Validators.required]
  });

  constructor(private uploadService: UploadService,
              private formBuilder: FormBuilder,
              private loaderService: LoaderService,
              private dialogRef: MatDialogRef<NewFilesDialogComponent>) { }

  ngOnInit() {
  }

  onFilesChange(event: any) {
    const eventFiles = event.target.files;
    
    if(eventFiles && eventFiles.length > 0){
      this.filesToUpload = eventFiles;
    }
    
    this.uploadFilesForm.patchValue({
      files: eventFiles
    });
  }

  uploadFiles() {
    this.loaderService.setSpinnerState(true);

    let formData: FormData = new FormData();
    formData.append('currentFolder', localStorage.getItem('currentFolder'));

    for(let file of this.filesToUpload){
      formData.append('files', file);
    };

    this.uploadService.uploadFiles(formData).subscribe(res => {
      this.loaderService.setSpinnerState(false);
      this.dialogRef.close();
    }, err => {
      this.dialogRef.close();
      this.loaderService.setSpinnerState(false);
      console.log(err);
    });
  }
}
