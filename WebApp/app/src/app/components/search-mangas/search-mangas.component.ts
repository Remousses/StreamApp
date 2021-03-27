import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Mangas } from 'src/app/utils/mangas';
import { common } from 'src/app/utils/common';

import { LoaderService } from 'src/app/services/loader/loader.service';
import { UploadService } from 'src/app/services/upload/upload.service';

@Component({
  selector: 'app-search-mangas',
  templateUrl: './search-mangas.component.html',
  styleUrls: ['./search-mangas.component.scss']
})
export class SearchMangasComponent implements OnInit {
  @Input() currentFolder;

  @Output() refreshFileExplorerView: EventEmitter<string> = new EventEmitter<string>();

  searchMangaSuccess: false;
  txtManga: string = '';
  txtMangaChapter: string = '';
  allMangas = Mangas;
  initRepo: string = common.initRepo;

  constructor(private uploadService: UploadService, private loaderService: LoaderService) {}

  ngOnInit() {
    this.allMangas.forEach(manga => {
      manga['value'] = manga.name.split(' ').join('-').toLowerCase();
    });
  }

  searchManga(): void {
    this.loaderService.setSpinnerState(true);
    new Promise<any>((resolve, reject) => {
      this.uploadService.searchManga(this.txtManga, this.txtMangaChapter).subscribe(res => {
        this.loaderService.setSpinnerState(false);
        resolve(true);
      }, err => {
        this.loaderService.setSpinnerState(false);
        reject(err);
      });
    }).then(res => {
      if(res){
        console.log('Execution du skipt shell terminée');
        this.refresh();
        this.searchMangaSuccess = res;
      }
    }).catch(err => console.log('Error from API', err));
  }

  refresh(): void {
    this.searchMangaSuccess = false;
    this.refreshFileExplorerView.emit();
  }
}
