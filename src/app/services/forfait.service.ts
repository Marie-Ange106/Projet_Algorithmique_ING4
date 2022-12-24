import { HttpClient } from '@angular/common/http';
import { ForfaitC } from './../enum/ForfaitC';
import { ForfaitValeur } from './../class/forfait-valeur';
import { Injectable } from '@angular/core';
import { Forfait } from '../class/forfait';
import { Priorite } from '../class/priorite';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})



export class ForfaitService {
  
  cache: number[][] = [];
  prix = 0;
  val = 0;
  constructor(private http: HttpClient) {

  }

  public getAllForfait(): Observable<Forfait[]> {
    return this.http.get<Forfait[]>("assets/forfait.json");
  }

  public printBestForfaits(forfaits: Forfait[], prix: number, jours: number, priorite: Priorite[]): ForfaitValeur[] {
    this.prix = prix;
    let forFaitsOptimaux: ForfaitValeur[] = [];
    let forfaitsValeur: ForfaitValeur[] = [];
    forfaits = this.filterForfaitParJours(jours, forfaits);
    forfaitsValeur = this.valorisationForfait(forfaits, priorite);
    //console.log(forfaitsValeur);
    while (this.prix > 0) {
      this.initCache(forfaits, this.prix);  
      
      forFaitsOptimaux = forFaitsOptimaux.concat(this.getOptimalForfait(forfaitsValeur));
      console.log(this.prix, forFaitsOptimaux);
      
      if(this.val == 0) {
        this.prix = 0;
        break;
      }
    }
    
    
    return forFaitsOptimaux;
  } 
  private initCache(forfaitVals: Forfait[], w: number) {
    this.cache = new Array(forfaitVals.length);
    for (let index = 0; index < forfaitVals.length; index++) {
      this.cache[index] = new Array(w+1)

    }

    for (let i = 0; i < forfaitVals.length; i++) {
      for (let j = 0; j <= w; j++) {
        this.cache[i][j] = 0;
      }
    }
  }

  private valMaxSacADosVDtd(forfaitVals: ForfaitValeur[], w: number, i: number): number {
    // if(i == 1 && cache[i][w] == 0)
    //System.out.println(i);
    /*if (w - 1 < 0)
        return 0;*/

    if (this.cache[i][w] > 0)
      return this.cache[i][w];
    if (i == 0)
      return 0;
    if (forfaitVals[i].forfait.prix > w) {
      this.cache[i][w] = this.valMaxSacADosVDtd(forfaitVals, w, i - 1);
      return this.cache[i][w];
    } else {
      this.cache[i][w] = this.max(this.valMaxSacADosVDtd(forfaitVals, w, i - 1), forfaitVals[i].valeur + this.valMaxSacADosVDtd(forfaitVals, (w - forfaitVals[i].forfait.prix), i - 1));
      //System.out.println(cache[i][w-1]);
      return this.cache[i][w];
    }
  }

  public max(a: number, b: number): number {
    if (a > b)
      return a;
    else
      return b;
  }

  private filterForfaitParJours(jours: number, forfaits: Forfait[]): Forfait[] {
    let temp: Forfait[] = [];
    temp = forfaits.filter(val => val.validite >= jours);
    /*  forfaits.forEach(val -> {
         if (forfait. >= heure)
             temp.add(forfait);
 
     }); */
    return temp;
  }

  private valorisationForfait(forfaits: Forfait[], priorites: Priorite[]): ForfaitValeur[] {
    let n = forfaits.length;
    let meanData = 0;
    let meanCall = 0;
    let meanSMS = 0;
    let priorityData = 0;
    let prioritySMS = 0;
    let priorityCall = 0;
    meanData = this.mean(forfaits, ForfaitC.DATA);
    meanCall = this.mean(forfaits, ForfaitC.APPEL);
    meanSMS = this.mean(forfaits, ForfaitC.SMS);
    for (const data of priorites) {
      if (data.composante == ForfaitC.DATA.toString())
        priorityData = data.valeur;
      if (data.composante == ForfaitC.APPEL.toString())
        priorityCall = data.valeur;
      if (data.composante == ForfaitC.SMS.toString())
        prioritySMS = data.valeur;
    }
    //console.log(priorityCall, priorityData, prioritySMS);
    


    let forfaitVals: ForfaitValeur[] = [];
    forfaits.forEach(forfait => {
      let value = (priorityData * (forfait.data / meanData) + priorityCall * (forfait.appel / meanCall) +
        prioritySMS * (forfait.sms / meanSMS));
      let forfaitValeur: ForfaitValeur = new ForfaitValeur();
      forfaitValeur.forfait = forfait;
      forfaitValeur.valeur = value;
      forfaitVals.push(forfaitValeur);
    });
    return forfaitVals;

  }

  private mean(val: Forfait[], component: ForfaitC): number {
    let n = val.length;
    let a = 0;
    for (const iterator of val) {
      if (component == ForfaitC.APPEL) {
        a += iterator.appel;
      }

      if (component == ForfaitC.DATA) {
        a += iterator.data;
      }

      if (component == ForfaitC.SMS) {
        a += iterator.sms;
      }
    }
    return a / n;
  }

  private getOptimalForfait(forfaits: ForfaitValeur[]): ForfaitValeur[] {
    let i = forfaits.length-1;
    this.val = this.valMaxSacADosVDtd(forfaits, this.prix, forfaits.length - 1);
    console.log("La valeur max de son prix est "+ this.val);
    let forfaitsOptimaux: ForfaitValeur[] = [];
    let j = this.prix;
    while (j > 0 && this.cache[i][j] == this.cache[i][j-1]) {
        j--;

    }
    while (j > 0 && i > 0) {
        while (i >0 && this.cache[i][j]== this.cache[i - 1][j]) {
            i--;
        }
        if(i >= 0)
            j -= forfaits[i].forfait.prix;
        if (j >= 0 && i >= 0) {
          this.prix -= forfaits[i].forfait.prix;
          forfaitsOptimaux.push(forfaits[i]);
        }
        
        i--;

    }
    //console.log(forfaitsOptimaux.length);
    
    return forfaitsOptimaux;
  }



}
