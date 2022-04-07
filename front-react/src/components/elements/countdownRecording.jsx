import { CountdownCircleTimer } from 'react-countdown-circle-timer'

const renderText = ({ remainingTime, label }) => {
    if (remainingTime === 0) {
        return <div className="timer">Recording...</div>;
    }

    return (
        <div className="timer">
            <div className="label">{label}</div>
            <div className="value">{remainingTime}</div>
        </div>
    );
};

function CountdownRecording({ duration, label }) {
    console.log("timer for", duration)
    return (
        <div className="timer-wrapper">
            <CountdownCircleTimer
                isPlaying
                duration={duration}
                colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
                colorsTime={[10, 6, 3, 0]}
                onComplete={() => ({ shouldRepeat: false, delay: 1 })}
                size={48}
                strokeWidth={5}
            >
                {({ remainingTime, elapsedTime, color }) => renderText(remainingTime, elapsedTime, color, label)}
            </CountdownCircleTimer>
        </div>
    );
}

export default CountdownRecording