import { ButtonNeutral } from "../elements/button";
import WebcamStreamCapture from "../elements/webcam";

function SetChair({ shouldUseVideo, handleNextGlobalStep }) {
  if (!shouldUseVideo) {
    setTimeout(handleNextGlobalStep, 1);
  }
  return (
    <div className="container">
      <h1 className="text-center">
        <div>
          Installez-vous confortablement. <br></br>
          Prenez le temps de régler votre siège.
        </div>
      </h1>

      <div>Voilà le retour de la caméra pour vous aider.</div>

      <WebcamStreamCapture />

      <ButtonNeutral handleClick={handleNextGlobalStep}>
        Je suis prêt
      </ButtonNeutral>
    </div>
  );
}

export default SetChair;
