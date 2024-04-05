import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AudioServiceService } from '../audio-service.service';

@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.css']
})
export class AudioComponent implements OnInit {
  isRecording = false;
  recordedAudioBlob: Blob | null = null;
  recordedAudioUrl: string | null = null;
  transcriptionResponse: JSON | null = null;
  str : string | null = null;
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  constructor(private audioServiceService: AudioServiceService, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.audioServiceService.audioBlob$.subscribe(blob => {
      this.recordedAudioBlob = blob;
      this.recordedAudioUrl = window.URL.createObjectURL(blob);
      this.audioPlayer.nativeElement.src = this.recordedAudioUrl;
      this.cd.detectChanges();

      if (this.recordedAudioBlob) {
        // Do something with the recorded audio blob
        console.log("Recorded audio blob:", this.recordedAudioBlob);
        this.transcribeAudio(this.recordedAudioBlob);

      } else {
        console.error("No recorded audio available.");
      }
      //this.playRecordedAudio();
    });
  }

  startRecording() {
    this.isRecording = true;
    this.audioServiceService.startRecording();
  }

  stopRecording() {
    this.isRecording = false;
    this.audioServiceService.stopRecording();
  }
  playRecordedAudio() {
    if (this.recordedAudioBlob) {
      const audioUrl = window.URL.createObjectURL(this.recordedAudioBlob);
      this.audioPlayer.nativeElement.src = audioUrl;
      this.audioPlayer.nativeElement.play();
    } else {
      console.error("No recorded audio available.");
    }
  }

  transcribeAudio(audioBlob: Blob) {
  // Convert Blob to File
  const audioFile = new File([audioBlob], 'recorded_audio.wav');
  
  // Log the audio file data
  console.log('Audio file:', audioFile);

  // Call the transcribeAudio service method
  // this.audioServiceService.transcribeAudio(audioFile)
  //   .then(transcript => {
  //     console.log('Transcription:', transcript);
  //     // Do something with the transcription if needed
  //   })
  //   .catch(error => {
  //     console.error('Error transcribing audio:', error);
  //   });

  this.audioServiceService.transcribeAudio(audioFile)
      .then(transcript => {
        this.transcriptionResponse = transcript; 
        console.log('Transcription:', this.transcriptionResponse);// Store the transcription response
        this.str= JSON.stringify(this.transcriptionResponse );
      })
      .catch(error => {
        console.error('Error transcribing audio:', error);
      });
}

}
