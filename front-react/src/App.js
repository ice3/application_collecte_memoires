import logo from './logo.svg';
import './App.css';
import VideoPlayer from './components/pages/video_presentation'
import AudioOrVideo from './components/pages/choose_audio_video';
import SetChair from './components/pages/set_chair';
import RecordMemories from './components/pages/questions';
import IdentificationFormSelection from './components/pages/id_form';
import Thanks from './components/pages/thanks';
import { useIdleTimer } from 'react-idle-timer'
import { createNewMemoryAndGetUUID, postUseVideo } from './network_operations';
import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';

const disableRightClick = ()=>{
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });
}

function App() {
  const timeout = 5*60*1000
  const handleOnActive = () => {}
  const handleOnIdle = () => {window.location.reload()}
  const {
    reset,
    pause,
    resume,
    getRemainingTime,
    getLastActiveTime,
    getElapsedTime
  } = useIdleTimer({
    timeout,
    onActive: handleOnActive,
    onIdle: handleOnIdle
  })

  const [globalStep, _setGlobalStep] = useState(4);
  const [useVideo, setUseVideo] = useState(true);
  const [memoryUUID, setMemoryUUID] = useState("");
  const setGlobalStep = (step_number) => { _setGlobalStep(step_number % steps.length) }
  const nextGlobalStep = () => { 
    console.log("next global step"); 
    setGlobalStep(globalStep + 1);
    if (memoryUUID === "") {
      createNewMemoryAndGetUUID(setMemoryUUID)
    }
  }

  useEffect(() => {
      disableRightClick()
  }, []);


  const steps = [
    { name: "Vidéo de présentation", component: <VideoPlayer/> },
    { name: "Audio ou vidéo", component: < AudioOrVideo handleAudioOrVideo={(useVideo) => { setUseVideo(useVideo); postUseVideo(useVideo, memoryUUID) }} /> },
    { name: "Réglage de la hauteur", component: <SetChair shouldUseVideo={useVideo} /> },
    { name: "Capture des mémoires", component: <RecordMemories shouldUseVideo={useVideo} /> },
    { name: "Formulaire d'identification", component: <IdentificationFormSelection /> },
    { name: "Remerciements", component: < Thanks /> }
  ]

  if (memoryUUID && memoryUUID.length === 0){
    return ""
  }

  return (
    React.cloneElement(
      steps[globalStep].component,
      { "handleNextGlobalStep": nextGlobalStep,  "memoryUUID":memoryUUID}
    )
  );
}

export default App;
