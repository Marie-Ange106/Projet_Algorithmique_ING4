import { Forfait } from './../class/forfait';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ForfaitsService {

  constructor(private httpClient:HttpClient) { }

  getForfait(): Observable<Forfait[]>{
    return this.httpClient.get<Forfait[]>("/assets/forfaits.json")
  }

  postData(forfaits: Forfait[]){
    return this.httpClient.post("/assets/forfait.json", forfaits)
}
}
