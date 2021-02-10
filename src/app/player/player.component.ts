import { Component, OnInit, ElementRef, ViewChild, } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { map, min } from 'rxjs/operators';
@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  msaapDisplayTitle = true;
  msaapDisplayPlayList = true;
  msaapPageSizeOptions = [2, 4, 6];
  msaapDisplayVolumeControls = true;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadState: Observable<string>;
  isuploading = false;
  hour = 1;
  sec = 59;
  min = 0;
  timer
  playingIndex;
  uploadProgress: Observable<number>;
  downloadURL: Observable<string>;
  // @ViewChild('player') player : ElementRef;
  selectedSong: any;
  @ViewChild('player') playerRef: ElementRef;
  player: any;
  constructor(
    private afStorage: AngularFireStorage,
    public firestore: AngularFirestore,
    private toastr: ToastrService

  ) { }
  playList = [

  ];
  ngOnInit() {
    this.getFiles()
    this.player = document.getElementById('pa');
  }

  async upload(event) {
    this.isuploading = true;

    if ('audio/mp3' !== event.target.files[0].type) {
      this.isuploading = false;
      console.error('Only MP3 files are alloded.');
      this.toastr.error('Only MP3 files are alloded.');
      return;
    }
    const fileData = {
      name: event.target.files[0].name,
      type: event.target.files[0].type,
      url: ''
    };
    const id = Math.random().toString(36).substring(2);
    this.ref = this.afStorage.ref(id);
    this.task = this.ref.put(event.target.files[0]);
    this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
    this.uploadProgress = this.task.percentageChanges();
    // tslint:disable-next-line: deprecation
    fileData.url = await (await this.task).ref.getDownloadURL();
    this.saveFile(fileData);
    this.uploadState = undefined;
  }
  getFiles() {
    this.firestore.collection('song').snapshotChanges().subscribe(res => {
      console.log('res', res)
      this.playList = res.map(item => {
        const data = item.payload.doc.data();
        data['id'] = item.payload.doc.id;
        return data;
      });
      console.log('this.playList', this.playList)
    });

  }
  saveFile(data) {
    this.isuploading = false;
    this.firestore.collection('song').add(data).then(res => {
      this.toastr.success('Track successfully added!');
    }, err => {
      this.toastr.error(err.message);
    });
  }
  set(song, index) {
    console.log('song', song);
    this.playTrack(song.url);
    this.playingIndex = index;
  }
  playTrack(previewUrl) {
    this.player.src = previewUrl;
    this.player.play();
  }

  pauseTrack() {
    this.player.pause();
  }

  playerEnded() {
    console.log('ddd');
    this.playingIndex = this.playingIndex < this.playList.length - 1 ? this.playingIndex + 1 : 0;
    this.selectedSong = this.playList[this.playingIndex];
    this.playTrack(this.playList[this.playingIndex].url)
  }
  deleteTrack(song) {
    console.log('sosssssng', song)
    try {
      let ref: any = this.firestore.collection('song')
      ref.doc(`${song.id}`).delete()
        .then((res) => {
          console.log('Document successfully deleted!');

          this.toastr.success('Track successfully deleted!');

        }).catch((error) => {
          console.error('Error removing document: ', error);
          this.toastr.error(error.message);
        });
      const data = this.afStorage.storage.refFromURL(song.url).delete();
    } catch (e) {
      this.toastr.error(e.message);
    }
  }
}
