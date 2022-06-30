import WebcamStreamCapture from "../elements/webcam";
import { ButtonNegative, ButtonPositive } from "../elements/button";
import CountdownRecording from "../elements/countdownRecording";
import { useState, useEffect } from "react";
import useSound from "use-sound";
import Microphone from "../elements/microphone";
import { sendAnswerMedia } from "../../network_operations";
import { marked } from "marked";

const MediaRecorder = ({
  shouldUseVideo,
  startRecording,
  stopRecording,
  isValid,
  handleIsValid,
  children,
}) => {
  return shouldUseVideo ? (
    <WebcamStreamCapture
      startRecording={startRecording}
      stopRecording={stopRecording}
      isValid={isValid}
      handleIsValid={handleIsValid}
    >
      {children}
    </WebcamStreamCapture>
  ) : (
    <Microphone
      startRecording={startRecording}
      stopRecording={stopRecording}
      isValid={isValid}
      handleIsValid={handleIsValid}
    >
      {children}
    </Microphone>
  );
};

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
  autoPlayQuestion,
}) {
  const [startRecording, setStartRecording] = useState(false);
  const [endRecordingTime, setEndRecordingTime] = useState(new Date());
  const [now, setNow] = useState(new Date());
  const [waitingToStart, setWaitingToStart] = useState(true);
  const [stopRecording, setStopRecording] = useState(false);
  const [isPreparingForRecord, setIsPreparingForRecord] = useState(false);
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
    setWaitingToStart(false);
    setIsPreparingForRecord(true);
    const recordStartTimer = setTimeout(() => {
      setIsPreparingForRecord(false);
      setIsRecording(true);

      const now = new Date();
      const endTime = new Date(now.getTime() + question.secondsDuration * 1000);
      setEndRecordingTime(endTime);

      setStartRecording(true);
      setStopRecording(false);
    }, question.secondsBeforeRecord * 1000);
    const recordStopTimer = setTimeout(() => {
      clearTimeout(recordStartTimer);
      setIsPreparingForRecord(false);
      setIsRecording(false);
      setStartRecording(false);
      setStopRecording(true);
    }, question.secondsDuration * 1000 + question.secondsBeforeRecord * 1000);
    return [recordStartTimer, recordStopTimer];
  };

  const stopTimers = (recordStartTimer, recordStopTimer, updateNow) => {
    if (recordStartTimer) clearTimeout(recordStartTimer);
    if (recordStopTimer) clearTimeout(recordStopTimer);
    if (updateNow) clearTimeout(updateNow);
  };

  const onStartAll = () => {
    const updateNow = setInterval(() => {
      setNow(new Date());
    }, 500);
    const [recordStartTimer, recordStopTimer] = startTimers();
    setTimers([recordStartTimer, recordStopTimer]);
    return () => stopTimers(recordStartTimer, recordStopTimer, updateNow);
  };

  if (autoPlayQuestion) {
    console.log("play question");
    play();
  }

  const handleIsValid = (memoryUUID, streamBlob) => {
    try {
      sendAnswerMedia(memoryUUID, question.uuid, streamBlob);
    } catch (err) {
      console.log(err.response.data.errors);
    }
  };

  const shouldStartAllButtonBeVisibleClass =
    waitingToStart && !isRecording && !isPreparingForRecord && !isPlaying
      ? "display"
      : "no-display";

  const prepareForRecordCountdownClass =
    !waitingToStart && isPreparingForRecord && !isPlaying
      ? "display"
      : "no-display";
  const recordingCountdownClass =
    !waitingToStart && isRecording && !isPlaying ? "display" : "no-display";
  const recordingEndedClass =
    !waitingToStart && !isRecording && !isPreparingForRecord && !isPlaying
      ? "display"
      : "no-display";
  const buttonValidateClass =
    !waitingToStart && !isRecording && !isPreparingForRecord && !isPlaying
      ? "visible"
      : "invisible";

  console.log(
    "shouldStartAllButtonBeVisibleClass",
    shouldStartAllButtonBeVisibleClass
  );
  console.log("prepareForRecordCountdownClass", prepareForRecordCountdownClass);
  console.log("recordingCountdownClass", recordingCountdownClass);
  console.log("recordingEndedClass", recordingEndedClass);
  console.log("buttonValidateClass", buttonValidateClass);
  console.log("");

  const playSound = () => {
    play();
  };

  const stopSound = () => {
    stop();
    stopTimers(...timers);
    invalidQuestion();
  };

  const showWebcam = isPlaying ? "invisible" : "visible";
  const playSOundButton = !isPlaying ? (
    <ButtonPositive handleClick={playSound}>
      Relire la question 🔊
    </ButtonPositive>
  ) : (
    <ButtonNegative handleClick={stopSound}>Stop ⏹️ </ButtonNegative>
  );
  const nbSecondsRecordRemaining = Math.round(
    (endRecordingTime.getTime() - new Date().getTime()) / 1000
  );

  return (
    <>
      <h1 className="text-left full-width mt-0">
        Question {step} / {numberOfQuestions}
      </h1>

      <div className="question">
        <div className="question-label">
          <div
            className="question-texte"
            dangerouslySetInnerHTML={{ __html: marked(question.value) }}
          ></div>

          <div className="question-voiceover">
            {question.voiceoverOrig.length > 0 ? playSOundButton : ""}
          </div>
        </div>

        <div className={["enregistrement", showWebcam].join(" ")}>
          <MediaRecorder
            startRecording={startRecording}
            stopRecording={stopRecording}
            isValid={isValid}
            handleIsValid={(blob) => handleIsValid(memoryUUID, blob)}
            shouldUseVideo={shouldUseVideo}
          >
            <div className={[prepareForRecordCountdownClass].join(" ")}>
              <CountdownRecording
                key={isPreparingForRecord}
                duration={question.secondsBeforeRecord}
              >
                Préparez-vous à répondre
              </CountdownRecording>
            </div>

            <div
              className={[recordingCountdownClass].join(" ")}
              key={recordingCountdownClass}
            >
              <CountdownRecording
                duration={question.secondsDuration}
                extra_class="indicator-top-shift"
              >
                <div
                  key={recordingCountdownClass + "-" + nbSecondsRecordRemaining}
                >
                  Enregistrement en cours <br></br>({nbSecondsRecordRemaining}{" "}
                  secondes restantes)
                </div>
              </CountdownRecording>
            </div>

            <div className={[shouldStartAllButtonBeVisibleClass].join(" ")}>
              <ButtonPositive
                handleClick={() => {
                  onStartAll();
                }}
              >
                Témoigner
              </ButtonPositive>
            </div>

            <div className={[recordingEndedClass].join(" ")}>
              Enregistrement terminé
            </div>
          </MediaRecorder>
        </div>

        <div className={["controls", buttonValidateClass].join(" ")}>
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
    </>
  );
}

export default Question;
