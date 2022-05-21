import WebcamStreamCapture from "../elements/webcam"
import {Button, ButtonNegative, ButtonPositive} from "../elements/button"
import CountdownRecording from "../elements/countdownRecording"
import { useState, useEffect } from "react"

import { sendAnswerMedia } from "../../network_operations"

const DELAY_BEFORE_RECORD = 3


function Question({ question, handleNextQuestion, shouldUseVideo, step, numberOfQuestions, memoryUUID, questionsOver, handleNextGlobalStep }) {
    const [startRecording, setStartRecording] = useState(false)
    const [stopRecording, setStopRecording] = useState(false)
    const [isPreparingForRecord, setIsPreparingForRecord] = useState(true)
    const [isRecording, setIsRecording] = useState(false)
    const [isValid, setIsValid] = useState(false)
    
    const startTimers = () => {
        const recordStartTimer = setTimeout(
            () => {
                setIsPreparingForRecord(false)
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
            
            const prepareForRecordCountdownClass = isPreparingForRecord ? "visible" : "invisible"
            const recordingCountdownClass = isRecording ? "visible": "invisible"
            const recordingEndedClass = !isRecording && !isPreparingForRecord ? "visible" : "invisible"
            
            
            return (
                <div className='question'>
                <div className="question-texte">
                {question.value}
                </div>
                
                <div className='enregistrement'>
                <WebcamStreamCapture startRecording={startRecording} stopRecording={stopRecording} isValid={isValid} handleIsValid={blob => handleIsValid(memoryUUID, blob)}>
               
               <div className={["absolute", prepareForRecordCountdownClass].join(" ")}>
                <CountdownRecording duration={DELAY_BEFORE_RECORD}>
                Préparez-vous à répondre
                </CountdownRecording> 
               </div>

               <div className={["absolute", recordingCountdownClass].join(" ")}>
                <CountdownRecording duration={question.secondsDuration}>
                Enregistrement en cours
                </CountdownRecording>
               </div>

               <div className={["absolute", recordingEndedClass].join(" ")}>
                Enregistrement terminé
                </div>

                </WebcamStreamCapture>
                </div>
                
               <div className={["controls", recordingEndedClass].join(" ")}>
                    <ButtonNegative handleCLick={() => {}}>
                    Refaire la prise
                    </ButtonNegative>
                    <ButtonPositive handleClick={() => { 
                        setIsValid(true); 
                        handleNextQuestion()
                        if(questionsOver){handleNextGlobalStep()}
                    }}>
                    Valider la prise
                    </ButtonPositive>
                    </div> 
                
                {step <= numberOfQuestions ? "" : "" }
                </div>
                )
            }
            
            export default Question