import React from "react";
import Webcam from "react-webcam";
import { toast } from "react-toastify";

let isDownloading = false;

const WebcamStreamCapture = ({
  isValid,
  shouldDisplayVideo,
  startRecording,
  stopRecording,
  handleIsValid,
  children,
}) => {
  const webcamRef = React.useRef(null);
  const mediaRecorderRef = React.useRef(null);
  const [capturing, setCapturing] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);

  const handleStartCaptureClick = React.useCallback(() => {
    setCapturing(true);
    toast.success("Enregistrement démarré");
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = React.useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = React.useCallback(() => {
    if (mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    toast.info("Enregistrement terminé");
    setCapturing(false);
  }, [mediaRecorderRef, webcamRef, setCapturing]);

  const handleDownload = React.useCallback(() => {
    if (recordedChunks.length) {
      isDownloading = true;
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      handleIsValid(blob);
      setRecordedChunks([]);
    }
    isDownloading = false;
  }, [recordedChunks, setRecordedChunks, isDownloading]);

  if (startRecording && !capturing) {
    handleStartCaptureClick();
  }

  if (stopRecording && capturing) {
    handleStopCaptureClick();
  }

  if (isValid === true && recordedChunks.length && !capturing) {
    handleDownload();
  }

  return (
    <div className="retour-video">
      {shouldDisplayVideo ? (
        <div className="video">
          <Webcam
            className="video-canvas"
            audio={true}
            ref={webcamRef}
            onUserMediaError={(e) =>
              console.error("Couldn't capture media devices", e)
            }
            onUserMedia={(e) => console.log("Could capture media device", e)}
            autoPlay={true}
            muted="muted"
          />
          <div className="indicateur">{children}</div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

WebcamStreamCapture.defaultProps = {
  startRecording: false,
  stopRecording: false,
  isValid: false,
  url: "",
  shouldDisplayVideo: true,
};

export default WebcamStreamCapture;
// https://www.npmjs.com/package/react-webcam
