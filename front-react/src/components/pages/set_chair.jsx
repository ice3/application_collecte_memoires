import NextStepButton from "../elements/nextStepButton"
import WebcamStreamCapture from "../elements/webcam"

function SetChair({ shouldUseVideo, handleNextGlobalStep }) {
    return (
        <>
            <div>Prêts à commencer ?</div>
            <NextStepButton handleNext={handleNextGlobalStep} label={"Etape suivante"} />
            <WebcamStreamCapture />
        </>
    )
}

export default SetChair