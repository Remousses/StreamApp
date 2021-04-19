import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SearchService } from 'src/app/services/search/search.service';
import { MatDialog } from '@angular/material';
import { SearchFileDialogComponent } from 'src/app/modals/search-file-dialog/search-file-dialog.component';

@Component({
  selector: 'app-search-file',
  templateUrl: './search-file.component.html',
  styleUrls: ['./search-file.component.scss']
})
export class SearchFileComponent implements OnInit {
  @Input() currentFolder: string;
  @Output() getContent: EventEmitter<string> = new EventEmitter<string>();
  @Output() getAllContentByRepo: EventEmitter<string> = new EventEmitter<string>();
  fileName = '';

  constructor(private searchServce: SearchService,
              private dialog: MatDialog) { }

  ngOnInit() { }

  searchFile() {
    this.searchServce.searchFile(this.currentFolder, this.fileName).subscribe(res => {
      this.dialog.open(SearchFileDialogComponent, {
        data: {
          fileName: this.fileName,
          files: res.files
        }
      }).afterClosed().subscribe(res => {
        this.getContent.emit(res);
        this.getAllContentByRepo.emit(res.match(/(.*[\\\/])/)[0].slice(0, -1));
      });
    }, err => {
      console.log(err);
    });
  }
}
