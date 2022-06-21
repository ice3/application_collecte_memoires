import React, { Component } from "react";
import { toast } from "react-toastify";
import { ReactMic } from "react-mic";

class Microphone extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recording: false,
      blob: null,
    };
  }

  start = () => {
    toast.success("Enregistrement démarré");
    this.setState({
      recording: true,
    });
  };

  stop = () => {
    toast.info("Enregistrement terminé");
    this.setState({
      recording: false,
    });
  };

  //audioData contains blob and blobUrl
  onStop = (audioData) => {
    console.log("audioData", audioData);
    this.setState({ blob: audioData.blob });
  };

  render() {
    const { recording } = this.state;
    const { startRecording, stopRecording, isValid, handleIsValid, children } =
      this.props;

    if (!recording && startRecording) {
      this.start();
    }

    if (recording && stopRecording) {
      this.stop();
    }

    if (isValid && !recording) {
      handleIsValid(this.state.blob);
    }
    return (
      <div>
        <ReactMic
          record={recording}
          className="sound-wave"
          onStop={this.onStop}
        />
        <div className="indicateur">{children}</div>
      </div>
    );
  }
}

export default Microphone;
