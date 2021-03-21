import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StreamService {

  constructor(private httpClient: HttpClient) { }

  getBase64Data(repo: string, type: string) {
    let search;
    switch (type) {
      case 'image':
          search = environment.searchImageUrl;
        break;
      
      case 'pdf':
          search = environment.searchPdfUrl;
        break;
    
      default:
        break;
    }
    
    return this.httpClient.get<any>(search + '?path=' + repo);
  }

  getAllContent(repo: string){
    return this.httpClient.get<any>(environment.domaineName + 'content?path=' + repo);
  }
}
