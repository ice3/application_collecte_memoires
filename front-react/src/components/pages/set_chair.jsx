import NextStepButton from "../elements/nextStepButton"
import WebcamStreamCapture from "../elements/webcam"

function SetChair({ shouldUseVideo, handleNextGlobalStep }) {
    return (
        <>
            <div>Prêts à commencer ?</div>
            <NextStepButton handleNextGlobalStep={handleNextGlobalStep} />
            <WebcamStreamCapture />
        </>
    )
}

export default SetChair