import React, { useState, useRef } from "react";
import SignatureCanvas from 'react-signature-canvas'

function Signature({ onSaved }) {
    let canvasRef = useRef()
    return (
        <div>

            <button
                onClick={() => {
                    canvasRef.clear();
                }}
            >
                Effacer
            </button>

            <button
                onClick={() => {
                    console.log(canvasRef.toDataURL());
                    onSaved(canvasRef.toDataURL())
                }}

            >
                Valider
            </button>
            <SignatureCanvas penColor='darkblue'
                canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
                ref={(ref) => { canvasRef = ref }} />

        </div>
    )

}

export default Signature