import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayerComponent } from './player/player.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFirestoreModule, AngularFirestore } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const firebaseConfig = {

  apiKey: "AIzaSyCvEmRdbo-6j_iSXwCiPYeqOvFp7z9SRzA",
  authDomain: "testdemo-397fb.firebaseapp.com",
  databaseURL: "https://testdemo-397fb.firebaseio.com",
  projectId: "testdemo-397fb",
  storageBucket: "testdemo-397fb.appspot.com",
  messagingSenderId: "704160501495",
  appId: "1:704160501495:web:9e72d7e4ba714aa50d8df2",
  measurementId: "G-TGB58QHQW5"
};
@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,

  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireStorageModule,
    AngularFirestoreModule,
    BrowserModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
