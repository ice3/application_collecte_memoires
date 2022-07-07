import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { ButtonNegative, ButtonPositive } from "../elements/button";

function Signature({ onSaved }) {
  let canvasRef = useRef();
  return (
    <div className="signature-container">
      <SignatureCanvas
        penColor="darkblue"
        canvasProps={{ width: 550, height: 300, className: "sigCanvas" }}
        ref={(ref) => {
          canvasRef = ref;
        }}
      />
      <div>
        <ButtonNegative
          handleClick={() => {
            canvasRef.clear();
          }}
        >
          Effacer
        </ButtonNegative>

        <ButtonPositive
          handleClick={() => {
            onSaved(canvasRef.toDataURL());
          }}
        >
          Valider
        </ButtonPositive>
      </div>
    </div>
  );
}

export default Signature;
