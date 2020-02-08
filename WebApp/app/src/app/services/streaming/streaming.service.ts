import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StreamingService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) { }

  getImage(repo){
    return this.httpClient.get<any>(environment.searchImageUrl + '?path=' + repo);
  }

  getAllContent(repo?: string){
    let url = '';
    if (!repo) {
      url = 'repositories';
    } else {
      url = 'content?path=' + repo;
    }

    return this.httpClient.get<any>(environment.domaineName + url);
  }
  
  searchManga(name: string, chapter: string){
    return this.httpClient.get<any>(environment.domaineName + 'Mangas/searchManga?name=' + name + '&chapter=' + chapter);
  }

  upload(uploadFileName: string, fileContent: string) {
    console.log("uploadFileName", uploadFileName, fileContent);

    return this.httpClient.put<any>(environment.domaineName + 'uploads', {name: uploadFileName, content: fileContent});
  }
 
  remove(fileName) {
    // this.httpClient.delete<any>('/uploads/' + fileName).subscribe(() => {
    //   this.fileList.splice(this.fileList.findIndex(name => name === fileName), 1);
    //   this.fileList$.next(this.fileList);
    // });
  }
}
