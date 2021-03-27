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
  private validate = new EventEmitter();
  addLinksForm: FormGroup;
  // inputNumber: number = 0;

  constructor(private uploadService: UploadService,
              private formBuilder: FormBuilder,
              private loaderService: LoaderService,
              private dialogRef: MatDialogRef<AddLinksDialogComponent> ) { }

  ngOnInit() {
    this.addLinksForm = this.formBuilder.group({
      formArray: this.formBuilder.array([])
    });
    // this.addLinksForm.addControl("folderName", new FormControl(null, Validators.required))
  }

  get formArray() {
    return <FormArray> this.addLinksForm.get('formArray');
 }

  addItem(): void {
    // this.inputNumber++;
    this.formArray.push(this.formBuilder.group({
      link: new FormControl('')
    }));

    // this.formBuilder.control(false)
  }
  
  removeItem(index: number) {
    // this.inputNumber--;
    console.log("index", index);
    
    this.formArray.removeAt(index);
  }

  validateLinks(): void{
    console.log("this.formArray.controls", this.formArray.controls);

    this.formArray.controls.forEach((element: any) => {
      console.log("element", element);
      console.log("element value", element.value);
      console.log("element value link", element.value.link);
      
    })
    
    // this.validate.emit(this.formArray.controls);
  }
}
