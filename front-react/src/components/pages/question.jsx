import WebcamStreamCapture from "../elements/webcam"
import NextStepButton from "../elements/nextStepButton"

function Question({ question, handleNextQuestion, shouldUseVideo, step, number }) {

    return (
        <>
            <div>
                {question.value} / {question.duration}
            </div>
            <div>
                {shouldUseVideo}
            </div>
            <div>
                {step} / {number}
            </div>
            <WebcamStreamCapture />
            {step < number ?
                <NextStepButton handleNext={handleNextQuestion} label={"Question suivante"} />
                : ""
            }
        </>
    )
}

export default Question