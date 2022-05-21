import { Component } from "react";
import ReactPlayer from 'react-player'
import {ButtonPositive, ButtonNeutral} from "../elements/button"
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
            <div className="container">
                <h1>But du dispositif</h1>
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
                <div className="controls">
                    <ButtonNeutral handleClick={this.handleReplay} >
                    Lancer la vidéo
                    </ButtonNeutral>
                    <ButtonPositive handleClick={this.props.handleNextGlobalStep} >
                    Etape suivante
                    </ButtonPositive>
                </div>
            </div>
        )
    }
}

export default VideoPlayer;