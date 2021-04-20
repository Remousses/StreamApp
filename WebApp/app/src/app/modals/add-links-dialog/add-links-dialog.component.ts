import { Component, OnInit, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { UploadService } from 'src/app/services/upload/upload.service';
import { MatDialogRef } from '@angular/material';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';
import { LoaderService } from 'src/app/services/loader/loader.service';

@Component({
  selector: 'app-add-links-dialog',
  templateUrl: './add-links-dialog.component.html',
  styleUrls: ['./add-links-dialog.component.scss']
})
export class AddLinksDialogComponent implements OnInit {
  addLinksForm: FormGroup;

  constructor(private uploadService: UploadService,
              private formBuilder: FormBuilder,
              private loaderService: LoaderService,
              private dialogRef: MatDialogRef<AddLinksDialogComponent> ) { }

  ngOnInit() {
    this.addLinksForm = this.formBuilder.group({
      formArray: this.formBuilder.array([this.formBuilder.control('', Validators.required)])
    });
  }

  cancel() {
    // this.dialogRef.close('cancel');
    this.dialogRef.close();
  }

  get formArray() {
    return this.addLinksForm.get('formArray') as FormArray;
 }

  addItem(): void {
    this.formArray.push(this.formBuilder.control('', Validators.required));
  }

  removeItem(index: number) {
    this.formArray.removeAt(index);
  }

  validateLinks(): void {
      this.loaderService.setSpinnerState(true);

      const dataToSend = {
        folderDestination: localStorage.getItem('currentFolder'),
        links: this.addLinksForm.controls.formArray.value
      };

      this.uploadService.uploadLinks(dataToSend).subscribe(_ => {
        this.loaderService.setSpinnerState(false);
        this.dialogRef.close();
      }, err => {
        this.dialogRef.close();
        this.loaderService.setSpinnerState(false);
        console.log(err);
      });
  }
}
