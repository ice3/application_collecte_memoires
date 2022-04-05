function AudioOrVideo({ handleNextGlobalStep, handleAudioOrVideo }) {
    return (<>
        <div> Audio ou vidéo ?</div>
        <button onClick={() => {
            handleAudioOrVideo(false)
            handleNextGlobalStep()
        }
        }>Audio</button>
        <button onClick={() => {
            handleAudioOrVideo(true)
            handleNextGlobalStep()
        }
        }>Video</button>
    </>
    )
}

export default AudioOrVideo