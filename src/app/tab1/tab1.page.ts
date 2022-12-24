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
  search = false;
  validite: number = 0;
  prix: number = 0;
  forfaits: Forfait[] = [];
  priorities: Priorite[] = [];
  forfait = new Map<string, {"forfait": Forfait, nb: number}>();
  constructor(private forfaitService: ForfaitService) {}
  
  ngOnInit(): void {
    this.priorities.push(new Priorite(ForfaitC.SMS.toString(), 0) )
    this.priorities.push(new Priorite(ForfaitC.APPEL.toString(), 0) )
    this.priorities.push(new Priorite(ForfaitC.DATA.toString(), 0) )
    this.forfaitService.getAllForfait().subscribe(
      (data: Forfait[]) => {
      this.forfaits = data;
      
    })
    
  }

  search_package(){
    this.search=true;
    
    
  }

  logForm() {
    this.search_package()
    let forfaitValeur = this.forfaitService.printBestForfaits(this.forfaits, this.prix, this.validite, this.priorities);
    forfaitValeur = this.sotForfaits(forfaitValeur);
    this.forfait = new Map<string, {"forfait": Forfait, nb: number}>();
    for (const iterator of forfaitValeur) {
      if(this.forfait.has(iterator.forfait.nom)) {
        this.forfait.set(iterator.forfait.nom, {"forfait": iterator.forfait, nb: this.forfait.get(iterator.forfait.nom)?.nb! + 1})
      } else {
        this.forfait.set(iterator.forfait.nom, {"forfait": iterator.forfait, nb: 1})
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
