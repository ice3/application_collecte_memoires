import { Component } from "react";
import ReactPlayer from 'react-player'
import NextStepButton from "../elements/nextStepButton";

class VideoPlayer extends Component {
    state = {
        url: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
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
            <div className='video-presentation'>
                <section className='section'>
                    <div className='player-wrapper'>
                        <ReactPlayer
                            ref={this.ref}
                            className='react-player'
                            width='100%'
                            played={played}
                            url={url}
                            playing={playing}
                            onEnded={this.handleEnded}
                        />
                    </div>
                    <button onClick={this.handleReplay}>Relancer la vidéo</button>
                    <NextStepButton handleNext={this.props.handleNextGlobalStep} label={"Etape suivante"} />
                </section>
            </div>
        )
    }
}

export default VideoPlayer;