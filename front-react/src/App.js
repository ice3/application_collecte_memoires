import logo from './logo.svg';
import './App.css';
import VideoPlayer from './components/pages/video_presentation'
import AudioOrVideo from './components/pages/choose_audio_video';
import SetChair from './components/pages/set_chair';
import RecordMemories from './components/pages/questions';
import IdentificationFormSelection from './components/pages/id_form';
import Thanks from './components/pages/thanks';

import React, { useState } from 'react';


function App() {
  const [globalStep, _setGlobalStep] = useState(4);
  const [useVideo, setUseVideo] = useState(true);
  const setGlobalStep = (step_number) => { _setGlobalStep(step_number % steps.length) }
  const nextGlobalStep = () => { setGlobalStep(globalStep + 1) }


  const steps = [
    { name: "Vidéo de présentation", component: <VideoPlayer /> },
    { name: "Audio ou vidéo", component: < AudioOrVideo handleAudioOrVideo={(useVideo) => { setUseVideo(useVideo) }} /> },
    { name: "Réglage de la hauteur", component: <SetChair shouldUseVideo={useVideo} /> },
    { name: "Capture des mémoires", component: <RecordMemories shouldUseVideo={useVideo} /> },
    { name: "Formulaire d'identification", component: <IdentificationFormSelection /> },
    { name: "Remerciements", component: < Thanks /> }
  ]

  return (
    React.cloneElement(
      steps[globalStep].component,
      { "handleNextGlobalStep": nextGlobalStep }
    )
  );
}

export default App;
