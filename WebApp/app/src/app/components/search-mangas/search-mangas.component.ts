import { Component, OnInit, Input } from '@angular/core';

import { Mangas } from 'src/app/utils/mangas';

import { StreamingService } from '../../services/streaming/streaming.service';

@Component({
  selector: 'app-search-mangas',
  templateUrl: './search-mangas.component.html',
  styleUrls: ['./search-mangas.component.scss']
})
export class SearchMangasComponent implements OnInit {
  @Input() currentFolder;
  timer: number = 10;
  txtManga: string = '';
  txtMangaChapter: string = '';
  allMangas = Mangas;

  constructor(private streamingService: StreamingService) { }

  ngOnInit() {
    this.allMangas.forEach(manga => {
      manga['value'] = manga.name.split(' ').join('-').toLowerCase();
    });
  }

  searchManga(name: string, chapter: string) {
    this.streamingService.searchManga(name, chapter).subscribe(res => {
      console.log('Execution du skipt shell en cours');
    }, err => {
      console.log(err);
    });

    this.timer = 10;
    const interval = setInterval(() => {
      this.timer--

      if (this.timer === 0) {
        clearInterval(interval);
      }

      console.log("this.timer", this.timer);
    }, 1000);
  }
}
