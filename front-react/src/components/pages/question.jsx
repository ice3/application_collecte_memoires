import WebcamStreamCapture from "../elements/webcam";
import { Button, ButtonNegative, ButtonPositive } from "../elements/button";
import CountdownRecording from "../elements/countdownRecording";
import { useState, useEffect } from "react";
import useSound from "use-sound";

import { sendAnswerMedia } from "../../network_operations";

const DELAY_BEFORE_RECORD = 3;

function Question({
  question,
  handleNextQuestion,
  shouldUseVideo,
  invalidQuestion,
  step,
  numberOfQuestions,
  memoryUUID,
  questionsOver,
  handleNextGlobalStep,
}) {
  const [startRecording, setStartRecording] = useState(false);
  const [stopRecording, setStopRecording] = useState(false);
  const [isPreparingForRecord, setIsPreparingForRecord] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isValid, setIsValid] = useState(undefined);
  const [timers, setTimers] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [play, { stop }] = useSound(question.voiceover, {
    onplay: () => {
      setIsPlaying(true);
      stopTimers(...timers);
    },
    onend: () => {
      setIsPlaying(false);
      invalidQuestion();
    },
  });

  const startTimers = () => {
    const recordStartTimer = setTimeout(() => {
      setIsPreparingForRecord(false);
      setIsRecording(true);
      setStartRecording(true);
      setStopRecording(false);
    }, DELAY_BEFORE_RECORD * 1000);
    const recordStopTimer = setTimeout(() => {
      clearTimeout(recordStartTimer);
      setIsPreparingForRecord(false);
      setIsRecording(false);
      setStartRecording(false);
      setStopRecording(true);
    }, question.secondsDuration * 1000 + DELAY_BEFORE_RECORD * 1000);
    return [recordStartTimer, recordStopTimer];
  };

  const stopTimers = (recordStartTimer, recordStopTimer) => {
    clearTimeout(recordStartTimer);
    clearTimeout(recordStopTimer);
  };

  useEffect(() => {
    const [recordStartTimer, recordStopTimer] = startTimers();
    setTimers([recordStartTimer, recordStopTimer]);
    return () => stopTimers(recordStartTimer, recordStopTimer);
  }, []);

  const handleIsValid = (memoryUUID, streamBlob) => {
    try {
      sendAnswerMedia(memoryUUID, question.uuid, streamBlob);
    } catch (err) {
      console.log(err.response.data.errors);
    }
  };

  const prepareForRecordCountdownClass =
    isPreparingForRecord && !isPlaying ? "visible" : "invisible";
  const recordingCountdownClass =
    isRecording && !isPlaying ? "visible" : "invisible";
  const recordingEndedClass =
    !isRecording && !isPreparingForRecord && !isPlaying
      ? "visible"
      : "invisible";

  const playSound = () => {
    play();
  };

  const stopSound = () => {
    stop();
    stopTimers(...timers);
    invalidQuestion();
  };

  console.log("isplaying", isPlaying);
  const showWebcam = isPlaying ? "invisible" : "visible";
  console.log(
    "display webcam",
    showWebcam,
    recordingCountdownClass,
    recordingEndedClass
  );

  const playSOundButton = !isPlaying ? (
    <ButtonPositive handleClick={playSound}>Lire la question 🔊</ButtonPositive>
  ) : (
    <ButtonNegative handleClick={stopSound}>Stop ⏹️ </ButtonNegative>
  );
  return (
    <div className="question">
      <div className="question-texte">
        <span>{question.value}</span>

        {question.voiceoverOrig.length > 0 ? (
          <span>{playSOundButton}</span>
        ) : (
          ""
        )}
      </div>

      <div className={["enregistrement", showWebcam].join(" ")}>
        <WebcamStreamCapture
          startRecording={startRecording}
          stopRecording={stopRecording}
          isValid={isValid}
          handleIsValid={(blob) => handleIsValid(memoryUUID, blob)}
        >
          <div
            className={["absolute", prepareForRecordCountdownClass].join(" ")}
          >
            <CountdownRecording duration={DELAY_BEFORE_RECORD}>
              Préparez-vous à répondre
            </CountdownRecording>
          </div>

          <div className={["absolute", recordingCountdownClass].join(" ")}>
            <CountdownRecording
              duration={question.secondsDuration}
              key={recordingCountdownClass}
            >
              Enregistrement en cours
            </CountdownRecording>
          </div>

          <div className={["absolute", recordingEndedClass].join(" ")}>
            Enregistrement terminé
          </div>
        </WebcamStreamCapture>
      </div>

      <div className={["controls", recordingEndedClass].join(" ")}>
        <ButtonNegative
          handleClick={() => {
            invalidQuestion();
          }}
        >
          Refaire la prise
        </ButtonNegative>
        <ButtonPositive
          handleClick={() => {
            setIsValid(true);
            // we need to let the time for the upload, we should be using a state instead
            setTimeout(handleNextQuestion, 30);
            if (questionsOver) {
              setTimeout(handleNextGlobalStep, 30);
            }
          }}
        >
          Valider la prise
        </ButtonPositive>
      </div>

      {step <= numberOfQuestions ? "" : ""}
    </div>
  );
}

export default Question;
