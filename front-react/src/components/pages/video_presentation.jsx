import { Component } from "react";
import ReactPlayer from "react-player";
import { ButtonPositive, ButtonNeutral } from "../elements/button";
class VideoPlayer extends Component {
  state = {
    url: "videos/video_reencodee.webm",
    playing: false,
    played: 0,
    pip: false,
  };

  constructor(props) {
    super(props);
    this.ref = (player) => {
      this.player = player;
    };
  }

  handlePlayPause = () => {
    this.setState({ playing: !this.state.playing });
  };

  handleReplay = () => {
    this.player.seekTo(0);
    this.setState({ played: 0, playing: true });
  };

  handleEnd = () => {
    this.setState({ played: 0, playing: false });
    this.props.handleNextGlobalStep();
  };

  render() {
    const { url, playing, played } = this.state;
    return (
      <div className="container">
        <h1>But du dispositif</h1>
        <div className="video-presentation">
          <ReactPlayer
            ref={this.ref}
            className="react-player"
            width="100%"
            height="100%"
            played={played}
            url={url}
            playing={playing}
          />
        </div>
        <div className="controls">
          <ButtonNeutral handleClick={this.handleReplay}>
            Lancer la vidéo
          </ButtonNeutral>
          <ButtonPositive handleClick={this.handleEnd}>
            Etape suivante
          </ButtonPositive>
        </div>
      </div>
    );
  }
}

export default VideoPlayer;
