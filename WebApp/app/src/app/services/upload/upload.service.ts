import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private httpClient: HttpClient) {}

  uploadFiles(formData: FormData) {
    return this.httpClient.put<any>(environment.domaineName + 'uploads/files', formData);
  }

  uploadLinks(formData: FormData) {
    return this.httpClient.put<any>(environment.domaineName + 'uploads/links', formData);
  }

  createFolder(currentFolder: string, folderName: string) {
    folderName = folderName.replace('/', '-');
    
    return this.httpClient.put<any>(environment.domaineName + 'createFolder', {currentFolder, folderName});
  }
 
  deleteFolder(currentFolder: string) {
    return this.httpClient.delete<any>(environment.domaineName + 'deleteFolder?currentFolder=' + currentFolder);
  }
 
  deleteFile(currentFolder: string, fileName: string) {
    return this.httpClient.delete<any>(environment.domaineName + 'deleteFile?currentFolder=' + currentFolder + '&fileName=' + fileName);
  }
}