import { NgxCsvParser } from 'ngx-csv-parser';
import { DowloadFileService } from './../services/dowload-file.service';
import { Forfait } from './../class/forfait';
import { Component } from '@angular/core';
import { ForfaitsService } from '../services/forfaits.service';
import { Papa } from 'ngx-papaparse';

export interface imgFile {
  name: string;
  filepath: string;
  size: number;
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  csvRecords: any;
  header: boolean = false;

   search = false;
   forfaits:Forfait[] = [];
   forfaitsPerOp:Forfait[] = [];
   operateurs = new Set();
   selectOp  = 'Mango';
   forfaitsUpload: Forfait[] = []
  constructor(
    private ngxCsvParser: NgxCsvParser,
    private forfaitsService:ForfaitsService, private downloadFile: DowloadFileService, private papaParse: Papa) {
  
  }


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
        console.log(this.forfaits);
        
        this.forfaitsPerOp = this.forfaits.filter(forfait => forfait.operateur == this.selectOp);
      }
    )
    
  };


  search_package(){
    this.search=true;
  }

  choosedOp(operator:any){
    this.selectOp = operator;
    this.forfaitsPerOp = this.forfaits.filter(forfait => forfait.operateur == operator);
  }

  openModal(){

  }

  download() {
    this.downloadFile.downloadFile()
  }

  uploadFile(e: any) {
    let fileReaded :any ;
    fileReaded = e.target.files[0];
    let type = e.target.files[0].name.split('.').pop();
    console.log(fileReaded);
    const fileList = e.target.files;
    console.log()

  this.header = (this.header as unknown as string) === 'true' || this.header === true;

    this.ngxCsvParser.parse(fileList[0], { header: this.header, delimiter: ',', encoding: 'utf8' })
      .pipe().subscribe({
        next: (result): void => {
          console.log('Result', result);
          this.csvRecords = result;
        }
      });
    
    this.papaParse.parse(fileList[0], {
   
      complete: (results, file) => {
        console.log('Parsed: ', results, file);
        let head = results.data.splice(0,1)[0];
        let cvsData = results.data;
        for (let i = 1; i < cvsData.length; i++) {
          let forfait = new Forfait();
          for (let j = 0; j < cvsData[i].length; j++) {
            if(i == 0) {
              forfait.nom = cvsData[i][j];
            }
            if(i == 1) {
              forfait.sms = cvsData[i][j];
            }
            if(i == 2) {
              forfait.appel = cvsData[i][j];
            }
            if(i == 3) {
              forfait.data = cvsData[i][j];
            }
            if(i == 4) {
              forfait.validite = cvsData[i][j];
            }
            if(i == 5) {
              forfait.prix = cvsData[i][j];
            }
            
          }
          this.forfaitsUpload.push(forfait)
        }
     console.log(this.forfaitsUpload);
     this.forfaits = this.forfaits.concat(this.forfaitsUpload)
    }
    });
  }

  papaParseChunk(chunk: any) {
    console.log("Chunk:", chunk.data);
  }

  papaParseCompleteFunction(results: any) {
     console.log('Results', results);
  }
}
