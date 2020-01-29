import { Component, OnInit } from '@angular/core';

import { StreamingService } from '../../services/streaming/streaming.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  videoList = [];
  videoLink: string = '';
  domaineName = 'http://localhost:8080/';
  musicsUrl = this.domaineName + 'musics/';
  musicUrl = this.musicsUrl + 'music';

  constructor(private streamingService: StreamingService) { }

  ngOnInit() {
    this.getAllVideos().then(videoList => {
      this.videoList = videoList;
    }).catch(err => console.log('Error from APIs', err));
  }

  getAllVideos(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.streamingService.getAllVideos().subscribe(res => {
        console.log('res', res)
        resolve(res.videoList);
      }, err => {
        reject(err);
      });
    });
  }

  getVideo(video: string){
    this.videoLink = this.musicUrl + '?name=' + video + '&searchVideo=true'
  }
}
