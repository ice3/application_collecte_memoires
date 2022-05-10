import { Component } from "react";
import ReactPlayer from 'react-player'
import NextStepButton from "../elements/nextStepButton";
import Button from "../elements/button";
class VideoPlayer extends Component {
    state = {
        url: "videos/video_reencodee.webm",
        playing: true,
        played: 0,
    }

    load = url => {
        this.setState({
            url,
            played: 0,
            loaded: 0,
            pip: false
        })
    }

    handlePlayPause = () => {
        this.setState({ playing: !this.state.playing })
    }

    handleReplay = () => {
        console.log("replay")
        this.setState({ played: 0, playing: true })
        this.player.seekTo(0)
    }


    ref = player => {
        this.player = player
    }


    render() {
        const { url, playing, played } = this.state
        console.log(played, playing)
        return (
            <>
                <div className='video-presentation'>
                    <ReactPlayer
                        ref={this.ref}
                        className='react-player'
                        width='100%'
                        height='100%'
                        played={played}
                        url={url}
                        playing={playing}
                        onEnded={this.handleEnded}
                    />
                </div>
                <div class="controls">
                    <Button label="Relancer la vidéo" handleClick={this.handleReplay}></Button>
                    <NextStepButton handleNext={this.props.handleNextGlobalStep} label={"Etape suivante"} />
                </div>
            </>
        )
    }
}

export default VideoPlayer;