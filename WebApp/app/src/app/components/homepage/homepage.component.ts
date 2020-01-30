import { Component, OnInit } from '@angular/core';

import { StreamingService } from '../../services/streaming/streaming.service';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  currentFolder: string = 'Repositories';
  returnButtonVisible: boolean = false;
  list = [];
  link: string = '';


  constructor(private streamingService: StreamingService) { }

  ngOnInit() {
    this.getAllContent().then(res => {
      this.list = res.list;
    }).catch(err => console.log('Error from APIs', err));

  }

  historyBack() {
    this.currentFolder = this.currentFolder.match(/(.*[\\\/])/)[0];
    let checkLastCharacter = this.currentFolder.substr(0, this.currentFolder.length - 1);

    if (this.currentFolder.endsWith('/')) {
      this.currentFolder = checkLastCharacter;
    }

    this.getAllContent(this.currentFolder).then(res => {
      this.list = res.list;
    }).catch(err => console.log('Error from APIs', err));
  }

  getAllContent(repo?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.streamingService.getAllContent(repo).subscribe(res => {
        resolve(res);
      }, err => {
        reject(err);
      });
    });
  }
  getContent(content: string) {
    let repo = this.currentFolder + '/' + content;

    if(!this.returnButtonVisible) {
      this.returnButtonVisible = true;
    }

    switch (content.split('.')[1]) {
      case 'mp3':
        this.link = environment.searchAudioUrl + '?name=' + content + '&path=' + repo;
        break;

      case 'mp4':
        this.link = environment.searchVideoUrl + '?name=' + content + '&path=' + repo;
        break;

      default:
        this.getAllContent(repo).then(res => {
          this.list = res.list;
          this.currentFolder = res.path;
        }).catch(err => console.log('Error from APIs', err));
        break;
    }
  }
}
