import WebcamStreamCapture from "../elements/webcam"
import NextStepButton from "../elements/nextStepButton"
import CountdownRecording from "../elements/countdownRecording"
import { useState, useEffect } from "react"

import { sendAnswerMedia } from "../../network_operations"

const DELAY_BEFORE_RECORD = 3


function Question({ question, handleNextQuestion, shouldUseVideo, step, numberOfQuestions, memoryUUID }) {
    const [startRecording, setStartRecording] = useState(false)
    const [stopRecording, setStopRecording] = useState(false)
    const [isPreparingForRecord, setIsPreparingForRecord] = useState(true)
    const [isRecording, setIsRecording] = useState(false)
    const [isValid, setIsValid] = useState(false)

    const startTimers = () => {
        const recordStartTimer = setTimeout(
            () => {
                setIsPreparingForRecord(true)
                setIsRecording(true)
                setStartRecording(true)
                setStopRecording(false)
            }, DELAY_BEFORE_RECORD * 1000
        );
        const recordStopTimer = setTimeout(
            () => {
                console.log("stop recording")
                clearTimeout(recordStartTimer);
                setIsPreparingForRecord(false)
                setIsRecording(false)
                setStartRecording(false)
                setStopRecording(true)
            }, (question.secondsDuration * 1000 + DELAY_BEFORE_RECORD * 1000)
        )
        return [recordStartTimer, recordStopTimer]
    }

    const stopTimers = (recordStartTimer, recordStopTimer) => {
        clearTimeout(recordStartTimer);
        clearTimeout(recordStopTimer);
    }

    useEffect(() => {
        const [recordStartTimer, recordStopTimer] = startTimers()
        return () => stopTimers(recordStartTimer, recordStopTimer)
    }, []);


    const handleIsValid = (memoryUUID, streamBlob) => {
        
          try {
            sendAnswerMedia(memoryUUID, question.uuid, streamBlob)
          } catch (err) {
            console.log(err.response.data.errors);
          }
        
    }

    const prepareForRecordCountdown = isPreparingForRecord ?
        <CountdownRecording duration={DELAY_BEFORE_RECORD} /> : ""

    const recordingCountdown = isRecording ?
        <CountdownRecording duration={question.secondsDuration} /> : ""

    return (
        <>
            <div>
                Question {step} / {numberOfQuestions}
            </div>
            <div>
                {question.value}
            </div>
            <div>
                {shouldUseVideo}
            </div>

            {prepareForRecordCountdown}
            {recordingCountdown}

            <WebcamStreamCapture startRecording={startRecording} stopRecording={stopRecording} isValid={isValid} handleIsValid={blob => handleIsValid(memoryUUID, blob)} />
            {step <= numberOfQuestions ?
                <>
                    <NextStepButton handleNext={handleNextQuestion} label={"Question suivante"} />
                    <NextStepButton handleNext={() => {
                        console.log("todo refaire la prise")
                    }} label={"Refaire la prise"} />
                    <NextStepButton handleNext={() => { setIsValid(true) }} label={"Valider la prise"} />
                </> : ""
            }
        </>
    )
}

export default Question