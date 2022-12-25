import { ForfaitValeur } from './../class/forfait-valeur';
import { ForfaitC } from './../enum/ForfaitC';
import { Priorite } from './../class/priorite';
import { Forfait } from './../class/forfait';
import { ForfaitService } from './../services/forfait.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  prioInvalid = false;
  prixInvalid = false;
  nbDayInvalid = false;

  search = false;
  validite: number = 0;
  prix: number = 0;
  forfaits: Forfait[] = [];
  priorities: Priorite[] = [];
  forfait = new Map<string, {"forfait": Forfait, nb: number}>();
  forfaitsByOp = new Map<string, Forfait[]>();
  bestforfaitsByOp = new Map<string, ForfaitValeur[]>();
  valeursTotals = new Map<string, {nbsms: number, nbappel: number, nbdata: number, total: number}>
  operateurs = new Set<string>();
  constructor(private forfaitService: ForfaitService) {}
  
  ngOnInit(): void {
    this.priorities.push(new Priorite(ForfaitC.SMS.toString(), 0) )
    this.priorities.push(new Priorite(ForfaitC.APPEL.toString(), 0) )
    this.priorities.push(new Priorite(ForfaitC.DATA.toString(), 0) )
    this.forfaitService.getAllForfait().subscribe(
      (data: Forfait[]) => {
      this.forfaits = data;
      this.forfaits.forEach(
        data => {
          this.operateurs.add(data.operateur)
        }
       )
       this.forfaitsByOp = this.forfaitService.getForfaitByOperator(this.forfaits, this.operateurs)
      //console.log(this.forfaitsByOp);
       
    })
    
  }

  search_package(){
    this.search=true;
  }

  logForm() {
    console.log(this.priorities);
    
    if(this.prix < 100 || this.prix > 1000000)
      this.prixInvalid = true;
    else
      this.prixInvalid = false;
    if(this.priorities[0].valeur < 0 || this.priorities[0].valeur > 3 || this.priorities[1].valeur < 0 || this.priorities[1].valeur > 3 || this.priorities[2].valeur < 0 || this.priorities[2].valeur > 3 || (this.priorities[0].valeur == 0 && this.priorities[1].valeur == 0 && this.priorities[2].valeur == 0))
      this.prioInvalid = true;
    else
      this.prioInvalid = false;

    if(this.validite < 1 || this.validite > 100)
      this.nbDayInvalid = true
    else
      this.nbDayInvalid = false

    if(!this.prixInvalid && !this.prioInvalid && !this.nbDayInvalid){
      this.search_package()
      this.forfait = new Map<string, {"forfait": Forfait, nb: number}>();
      this.forfaitsByOp.forEach(val => {
      })

      for (const val of this.forfaitsByOp) {
        let forfaitValeur = this.forfaitService.printBestForfaits(val[1], this.prix, this.validite, this.priorities);
        forfaitValeur = this.sotForfaits(forfaitValeur);
        

        for (const iterator of forfaitValeur) {
          if(this.forfait.has(iterator.forfait.nom)) {
            this.forfait.set(iterator.forfait.nom, {"forfait": iterator.forfait, nb: this.forfait.get(iterator.forfait.nom)?.nb! + 1})
          } else {
            this.forfait.set(iterator.forfait.nom, {"forfait": iterator.forfait, nb: 1})
          }
          
        }
        val[1].forEach(data => {
          if(this.valeursTotals.has(val[0])) {
          
            this.valeursTotals.set(val[0], {
              nbsms: this.valeursTotals.get(val[0])?.nbsms! + data.sms,
              nbappel: this.valeursTotals.get(val[0])?.nbappel! + data.appel,
              nbdata: this.valeursTotals.get(val[0])?.nbdata! + data.data,
              total: this.valeursTotals.get(val[0])?.total! + data.prix
            })
          } else {
            this.valeursTotals.set(val[0], {
              nbsms: data.sms,
              nbappel: data.appel,
              nbdata: data.data,
              total: data.prix
            })
          }
        })
        //console.log(this.valeursTotals);
        
      }
    }
   // console.log(this.forfait);
    
   
  }

  updatePriority(e: any, i: number) {
    this.priorities[i].valeur = parseInt(e.target.value, 10);
  }

  sotForfaits(forfaitValeur: ForfaitValeur[]) {
    forfaitValeur.sort(
    (a, b) => {
      if(a.forfait.prix > b.forfait.prix)
        return 1;
      if(a.forfait.prix < b.forfait.prix)
        return -1;
      return 0;
    })
    //console.log(forfaitValeur);
    
    return forfaitValeur;
  }

}
