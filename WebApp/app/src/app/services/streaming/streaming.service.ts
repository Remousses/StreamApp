import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StreamingService {

  constructor(private httpClient: HttpClient) { }

  getAllContent(repo?: string){
    let url = '';
    if (!repo) {
      url = 'repositories';
    } else {
      url = 'content?path=' + repo;
    }

    return this.httpClient.get<any>(environment.domaineName + url);
  }
}
