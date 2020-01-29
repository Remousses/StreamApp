import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StreamingService {

  constructor(private httpClient: HttpClient) { }

  getAllVideos(){
    // const options = term ?
    // { params: new HttpParams().set('name', term) } : {};
console.log('getAllVideos')
    return this.httpClient.get<any>('http://localhost:8080/musics');
  }
}
