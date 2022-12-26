import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule,HttpClient} from '@angular/common/http';

// Firebase + environment
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';
import { HTTP } from '@ionic-native/http/ngx';
import { File } from '@ionic-native/file/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx'
import { NgxCsvParserModule } from 'ngx-csv-parser';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    //AngularFireModule.initializeApp(environment.firebase),  
    AngularFirestoreModule,
    IonicModule.forRoot(), AppRoutingModule,HttpClientModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    
  
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },HttpClient, File, HTTP, NgxCsvParserModule,
    SocialSharing
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
