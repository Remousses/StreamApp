import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Mangas } from 'src/app/utils/mangas';

import { StreamService } from '../../services/stream/stream.service';
import { LoaderService } from 'src/app/services/loader/loader.service';

@Component({
  selector: 'app-search-mangas',
  templateUrl: './search-mangas.component.html',
  styleUrls: ['./search-mangas.component.scss']
})
export class SearchMangasComponent implements OnInit {
  @Input() currentFolder;

  @Output() refreshView: EventEmitter<string> = new EventEmitter<string>();

  searchMangaSuccess: false;
  txtManga: string = '';
  txtMangaChapter: string = '';
  allMangas = Mangas;

  constructor(private streamService: StreamService, private loaderService: LoaderService) { }

  ngOnInit() {
    this.allMangas.forEach(manga => {
      manga['value'] = manga.name.split(' ').join('-').toLowerCase();
    });
  }

  searchManga(name: string, chapter: string):void {
    this.loaderService.setSpinnerState(true);
    new Promise<any>((resolve, reject) => {
      this.streamService.searchManga(name, chapter).subscribe(res => {
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

  refresh(){
    this.searchMangaSuccess = false;
    this.refreshView.emit();
  }
}
