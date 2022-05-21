import {ButtonNeutral} from "../elements/button"

function AudioOrVideo({ handleNextGlobalStep, handleAudioOrVideo }) {
    return (
        <div className="container">
        
        <h1 className="text-center">
        Voulez vous effectuer un <br /> 
        enregistrement <br />
        vidéo ou audio ?
        </h1>
        
        <div className="controls">
        <ButtonNeutral handleClick={() => {
            handleAudioOrVideo(true)
            handleNextGlobalStep()
        }
    }>Video</ButtonNeutral>
    <ButtonNeutral handleClick={() => {
        handleAudioOrVideo(false)
        handleNextGlobalStep()
    }
}>Audio</ButtonNeutral>
</div>
</div>
)
}

export default AudioOrVideo