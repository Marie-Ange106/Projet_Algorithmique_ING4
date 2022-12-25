import { Forfait } from './../class/forfait';
import { Component } from '@angular/core';
import { ForfaitsService } from '../services/forfaits.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
   search = false;
   forfaits:Forfait[] = [];
   forfaitsPerOp:Forfait[] = [];
   operateurs = new Set();
   selectOp  = 'Mango';
   constructor(private forfaitsService:ForfaitsService) { }
   
   ionViewDidEnter(){
     //subcrive recure la valeur et la met dans reponse
     this.forfaitsService.getForfait().subscribe(
       (reponse: Forfait[])=>{
         this.forfaits=reponse
         this.forfaits.forEach(
          data => {
            this.operateurs.add(data.operateur)
          }
         )
         this.forfaitsPerOp = this.forfaits.filter(forfait => forfait.operateur == this.selectOp);
         console.log(this.forfaits);
       }
     )
     
   };


  search_package(){
    this.search=true;
  }

  choosedOp(operator:any){
    console.log(this.forfaits);
    this.selectOp = operator;
    this.forfaitsPerOp = this.forfaits.filter(forfait => forfait.operateur == operator);
  }

}
