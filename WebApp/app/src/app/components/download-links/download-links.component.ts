import { Component, OnInit } from '@angular/core';

import { common } from 'src/app/utils/common';
import { MatDialog } from '@angular/material';
import { AddLinksDialogComponent } from 'src/app/modals/add-links-dialog/add-links-dialog.component';

import { LoaderService } from 'src/app/services/loader/loader.service';
import { UploadService } from 'src/app/services/upload/upload.service';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-download-links',
  templateUrl: './download-links.component.html',
  styleUrls: ['./download-links.component.scss']
})
export class DownloadLinksComponent implements OnInit {
  
  folderDestination: string = '';
  initRepo: string = common.initRepo;
  allLinks: Array<AbstractControl> = [];

  constructor(private uploadService: UploadService,
              private dialog: MatDialog,
              private loaderService: LoaderService) { }

  ngOnInit() {
  }

  openNewLinksDialog() {
    let dialogRef = this.dialog.open(AddLinksDialogComponent);
    dialogRef.afterClosed().subscribe(res => {
      console.log('openNewLinksDialog', res);
      // this.allLinks.pus
    });
  }

  download(): void {
    this.loaderService.setSpinnerState(true);

    let formData: FormData = new FormData();
    formData.append('folderDestination', this.folderDestination);

    

    for(let item of this.allLinks){
      console.log("item.value", item.value);
      
      formData.append('links', item.value);
    };

    // this.uploadService.uploadLinks(formData).subscribe(res => {
    //   this.loaderService.setSpinnerState(false);
    //   this.dialogRef.close();
    // }, err => {
    //   this.dialogRef.close();
    //   this.loaderService.setSpinnerState(false);
    //   console.log(err);
    // });
  }
}
