import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class DowloadFileService {

  private downloadedFile: any;

  constructor(private file: File, private http: HTTP) { }

  downloadFile() {
    var url = "assets/forfaits.json";
    this.http.sendRequest(url, { method: "get", responseType: "arraybuffer" }).then(
      httpResponse => {
        console.log("File dowloaded successfully")
        this.downloadedFile = new Blob([httpResponse.data], { type: 'application/json' });
      }
    ).catch(err => {
      console.error(err);
    })
  }
}
