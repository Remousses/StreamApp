import { Component, OnInit } from '@angular/core';
import { StreamService } from 'src/app/services/stream/stream.service';
import { Validators, FormBuilder } from '@angular/forms';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { MatDialogRef } from '@angular/material';
import { UploadService } from 'src/app/services/upload/upload.service';

@Component({
  selector: 'app-new-folder-dialog',
  templateUrl: './new-folder-dialog.component.html',
  styleUrls: ['./new-folder-dialog.component.scss']
})
export class NewFolderDialogComponent implements OnInit {
  folderName: string = '';
  createFolderForm = this.formBuilder.group({
    folderName: [null, Validators.required]
  });

  constructor(private uploadService: UploadService,
              private formBuilder: FormBuilder,
              private loaderService: LoaderService,
              private dialogRef: MatDialogRef<NewFolderDialogComponent>) { }

  ngOnInit() {
  }

  onSubmit() {
    this.loaderService.setSpinnerState(true);

    this.uploadService.createFolder(localStorage.getItem('currentFolder'), this.createFolderForm.value.folderName).subscribe(res => {
      console.log("onSubmit", res);
      this.loaderService.setSpinnerState(false);
      this.dialogRef.close();
    }, err => {
      this.dialogRef.close();
      this.loaderService.setSpinnerState(false);
      console.log(err);
    });
  }
}
