import React, { Component } from "react";

import AudioReactRecorder, { RecordState } from "audio-react-recorder";

class Microphone extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recordState: RecordState.NONE,
      blob: null,
    };
  }

  start = () => {
    this.setState({
      recordState: RecordState.START,
    });
  };

  stop = () => {
    this.setState({
      recordState: RecordState.STOP,
    });
  };

  //audioData contains blob and blobUrl
  onStop = (audioData) => {
    console.log("audioData", audioData);
    this.setState({ blob: audioData.blob });
  };

  render() {
    const { recordState } = this.state;
    const { startRecording, stopRecording, isValid, handleIsValid, children } =
      this.props;

    console.log("record state", recordState);
    const captureStopped =
      recordState === RecordState.NONE || recordState === RecordState.STOP;
    if (captureStopped && startRecording) {
      this.start();
    }

    if (recordState === RecordState.START && stopRecording) {
      this.stop();
    }

    if (isValid && recordState === RecordState.STOP) {
      handleIsValid(this.state.blob);
    }
    return (
      <div>
        <AudioReactRecorder
          state={recordState}
          onStop={this.onStop}
          type="audio/mpeg-3"
        />
        <div className="indicateur">{children}</div>
      </div>
    );
  }
}

export default Microphone;
