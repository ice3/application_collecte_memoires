import logo from './logo.svg';
import './App.css';
import VideoPlayer from './components/pages/video_presentation'
import AudioOrVideo from './components/pages/choose_audio_video';
import SetChair from './components/pages/set_chair';
import RecordMemories from './components/pages/questions';
import IdentificationFormSelection from './components/pages/id_form';
import Thanks from './components/pages/thanks';
import { useIdleTimer } from 'react-idle-timer'
import { createNewMemoryAndGetUUID, postUseVideo, fetchMedias } from './network_operations';
import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const disableRightClick = ()=>{
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });
}

function App() {
  const [globalStep, _setGlobalStep] = useState(0);
  const [useVideo, setUseVideo] = useState(true);
  const [memoryUUID, setMemoryUUID] = useState("");
  const [mediasInfos, setMediaInfos] = useState({});
  const setGlobalStep = (step_number) => { _setGlobalStep(step_number % steps.length) }
  const nextGlobalStep = () => { 
    console.log("next global step"); 
    setGlobalStep(globalStep + 1);
    if (memoryUUID === "") {
      createNewMemoryAndGetUUID(setMemoryUUID)
    }
  }

  const timeout = mediasInfos.seconds_before_idle * 1000
  const handleOnIdle = () => {window.location.reload()}
  const handleOnActive = () => {}
  const {
    start, 
    reset,
    pause,
    resume,
    getRemainingTime,
    getLastActiveTime,
    getElapsedTime
  } = useIdleTimer({
    timeout: timeout,
    onActive: handleOnActive,
    onIdle: handleOnIdle,
    startOnMount: false,  // before logged in, do not start idle timer
    startManually: true,
  })

  
  useEffect(() => {
    if(mediasInfos.seconds_before_idle){ 
      start()
    }
  }, [mediasInfos])


  useEffect(() => {
    disableRightClick();
    fetchMedias(setMediaInfos);
}, []);

  const steps = [
    { name: "Vidéo de présentation", component: <VideoPlayer mediaPath={mediasInfos.opening_video}/> },
    { name: "Audio ou vidéo", component: < AudioOrVideo handleAudioOrVideo={(useVideo) => { setUseVideo(useVideo); postUseVideo(useVideo, memoryUUID) }} /> },
    { name: "Réglage de la hauteur", component: <SetChair shouldUseVideo={useVideo} /> },
    { name: "Capture des mémoires", component: <RecordMemories shouldUseVideo={useVideo} /> },
    { name: "Formulaire d'identification", component: <IdentificationFormSelection /> },
    { name: "Remerciements", component: < Thanks mediaPath={mediasInfos.closing_picture}/> }
  ]

  if (memoryUUID && memoryUUID.length === 0){
    return ""
  }

  const backgroundColor = `${mediasInfos.background_color || "#EBEBF4"}`;
  console.log(backgroundColor)

  return (
    <>
          <ToastContainer autoClose={1500} hideProgressBar={false}></ToastContainer>
        <div style={{width: "100%", height: "100%"}} ref={(node) => node? node.style.setProperty("background-color", backgroundColor, "important"):""}>

        {React.cloneElement(
          steps[globalStep].component,
          { "handleNextGlobalStep": nextGlobalStep,  "memoryUUID":memoryUUID}
          )}
          </div>
    </>
  );
}

export default App;
