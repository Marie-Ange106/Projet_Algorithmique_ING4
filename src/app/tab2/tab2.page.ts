import { Forfait } from './../class/forfait';
import { Component } from '@angular/core';
import { ForfaitsService } from '../services/forfaits.service';
import { finalize, tap } from 'rxjs/operators';
import { AngularFireStorage, AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

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

  // File upload task
  fileUploadTask!: AngularFireUploadTask;
  // Upload progress
  percentageVal!: Observable<number | undefined>;
  // Track file uploading with snapshot
  trackSnapshot!: Observable<any>;
  // Uploaded File URL
  UploadedImageURL!: Observable<string>;
  // Uploaded image collection
  files!: Observable<imgFile[]>;
  // Image specifications
  imgName!: string;
  imgSize!: number;
  // File uploading status
  isFileUploading!: boolean;
  isFileUploaded!: boolean;
  private filesCollection: AngularFirestoreCollection<imgFile>;

   search = false;
   forfaits:Forfait[] = [];
   forfaitsPerOp:Forfait[] = [];
   operateurs = new Set();
   selectOp  = 'Mango';
  constructor( private afs: AngularFirestore,private afStorage: AngularFireStorage, private forfaitsService:ForfaitsService) {
    this.isFileUploading = false;
    this.isFileUploaded = false;
    // Define uploaded files collection
    this.filesCollection = afs.collection<imgFile>('imagesCollection');
    this.files = this.filesCollection.valueChanges();
  }

  uploadImage(event: FileList) {
    const file = event.item(0);
    // Image validation
    if (file!.type.split('/')[0] !== 'image') {
      console.log('File type is not supported!');
      return;
    }
    this.isFileUploading = true;
    this.isFileUploaded = false;
    this.imgName = file!.name;
    // Storage path
    const fileStoragePath = `filesStorage/${new Date().getTime()}_${file!.name}`;
    // Image reference
    const imageRef = this.afStorage.ref(fileStoragePath);
    // File upload task
    this.fileUploadTask = this.afStorage.upload(fileStoragePath, file);
    // Show uploading progress
    this.percentageVal = this.fileUploadTask.percentageChanges();
    this.trackSnapshot = this.fileUploadTask.snapshotChanges().pipe(
      finalize(() => {
        // Retreive uploaded image storage path
        this.UploadedImageURL = imageRef.getDownloadURL();
        this.UploadedImageURL.subscribe(
          (resp) => {
            this.storeFilesFirebase({
              name: file!.name,
              filepath: resp,
              size: this.imgSize,
            });
            this.isFileUploading = false;
            this.isFileUploaded = true;
          },
          (error) => {
            console.log(error);
          }
        );
      }),
      tap((snap:any) => {
        this.imgSize = snap.totalBytes;
      })
    );
  }
   
  storeFilesFirebase(image: imgFile) {
    const fileId = this.afs.createId();
    this.filesCollection
      .doc(fileId)
      .set(image)
      .then((res:any) => {
        console.log(res);
      })
      .catch((err:any) => {
        console.log(err);
      });
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
}
