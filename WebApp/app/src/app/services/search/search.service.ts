import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private httpClient: HttpClient) { }

  searchManga(name: string, chapter: string){
    return this.httpClient.get<any>(environment.domaineName + 'searchManga?name=' + name + '&chapter=' + chapter);
  }

  searchFile(repo: string, fileName: string) {
    return this.httpClient.get<any>(environment.domaineName + 'searchFile?path=' + repo + '&fileName=' + fileName);
  }
}
