import React, { Component } from 'react';
import Webcam from "react-webcam";
import Sound from 'react-sound';
import './App.css';
import api from './api';
import mp3 from './assets/not_found.mp3';

class App extends Component {
  state = {
    mp3_base64: ''
  }

  setRef = webcam => {
    this.webcam = webcam;
  };

  base64ToBlob = (dataURL) => {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) === -1) {
      var parts = dataURL.split(',');
      var contentType = parts[0].split(':')[1];
      var raw = decodeURIComponent(parts[1]);
      return new Blob([raw], { type: contentType });
    }
    parts = dataURL.split(BASE64_MARKER);
    contentType = parts[0].split(':')[1];
    raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  }

  uploadImage = async (image) => {
    const response = await api.post('/upload', image)
    console.log(response);
  }

  analyzeImage = async () => {
    const imageSrc = this.webcam.getScreenshot();
    const blob = this.base64ToBlob(imageSrc);
    this.uploadImage(blob);
    const audio = await api.get('/');
    if (audio.data.Message === "SYNTHESIS_FAILURE") {
      this.setState({audio_base64: mp3})
    } else {
      this.setState({audio_base64: 'data:audio/ogg;base64,' + audio.data.Audio})
    }
  };

  stopPlaying


  render() {
    let audio_base64 = '';
    if (this.state.audio_base64) {
      audio_base64 = this.state.audio_base64;
    }

    return (
      <div className="App">
        <div className="row">
          <div className="column">
            <Webcam
              ref={this.setRef}
              screenshotFormat="image/jpeg"
            />
          </div>
          <div className="column" style={{ textAlign: 'left' }}>
            <button
              className="button"
              onClick={this.analyzeImage}
            >
              Read
            </button>
            <Sound
              url={audio_base64}
              playStatus={Sound.status.PLAYING}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;