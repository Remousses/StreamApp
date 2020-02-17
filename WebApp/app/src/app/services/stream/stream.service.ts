import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StreamService {

  constructor(private httpClient: HttpClient) { }

  getImage(repo: string){
    return this.httpClient.get<any>(environment.searchImageUrl + '?path=' + repo);
  }

  getAllContent(repo: string){
    return this.httpClient.get<any>(environment.domaineName + 'content?path=' + repo);
  }
  
  searchManga(name: string, chapter: string){
    return this.httpClient.get<any>(environment.domaineName + 'Mangas/searchManga?name=' + name + '&chapter=' + chapter);
  }
}
