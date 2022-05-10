import React from "react";
import { findAllInRenderedTree } from "react-dom/test-utils";
import Webcam from "react-webcam";

let isDownloading = false

const WebcamStreamCapture = ({ isValid, url, shouldDisplayVideo, startRecording, stopRecording }) => {
    const webcamRef = React.useRef(null);
    const mediaRecorderRef = React.useRef(null);
    const [capturing, setCapturing] = React.useState(false)
    const [recordedChunks, setRecordedChunks] = React.useState([])

    const handleStartCaptureClick = React.useCallback(() => {
        console.log("start capture")
        setCapturing(true);
        mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
            mimeType: "video/webm"
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
        console.log("stopped capture")
        if (mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
        }
        setCapturing(false);
    }, [mediaRecorderRef, webcamRef, setCapturing]);

    const handleDownload = React.useCallback(() => {
        if (recordedChunks.length) {
            isDownloading = true
            console.log("downloading")
            const blob = new Blob(recordedChunks, {
                type: "video/webm"
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            a.href = url;
            a.download = "react-webcam-stream-capture.webm";
            a.click();
            window.URL.revokeObjectURL(url);
            setRecordedChunks([]);
        }
        isDownloading = false
    }, [recordedChunks, setRecordedChunks]);

    if (startRecording && !capturing) {
        console.log("click start capture")
        handleStartCaptureClick()
    }

    if (stopRecording && capturing) {
        console.log("click stop capture")
        handleStopCaptureClick()
    }

    if (isValid && recordedChunks.length && !capturing) {
        console.log("is valid")
        handleDownload()
    }


    return (
        <>
            {shouldDisplayVideo ?
                <Webcam
                    audio={true}
                    ref={webcamRef}
                    onUserMediaError={e => console.error("Couldn't capture media devices", e)}
                    onUserMedia={e => console.log("Could capture media device", e)}
                /> : ""
            }
        </>
    );
};


WebcamStreamCapture.defaultProps = {
    startRecording: false, stopRecording: false, isValid: false, url: "", shouldDisplayVideo: true
}

export default WebcamStreamCapture
  // https://www.npmjs.com/package/react-webcam
