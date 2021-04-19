import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-search-file-dialog',
  templateUrl: './search-file-dialog.component.html',
  styleUrls: ['./search-file-dialog.component.scss']
})
export class SearchFileDialogComponent implements OnInit {
  fileName: string;
  files: [];

  constructor(private dialogRef: MatDialogRef<SearchFileDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data) {
    this.fileName = data.fileName;
    this.files = data.files;
  }

  ngOnInit() { }

  close(data?: any) {
    this.dialogRef.close(data);
  }
}
