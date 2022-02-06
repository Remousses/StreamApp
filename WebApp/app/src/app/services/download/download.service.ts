import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(private http: HttpClient) {}

  download(name: string, path: string): Observable<Blob> {
    return this.http.get(`${environment.domaineName}downloads/files?name=${name}&path=${path}`, {
      responseType: 'blob'
    });
  }
}
