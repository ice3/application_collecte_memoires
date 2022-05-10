import React, { useState, useRef } from "react";
import SignatureCanvas from 'react-signature-canvas'

function Signature() {
    let canvasRef = useRef()
    return (
        <div>

            <button
                onClick={() => {
                    canvasRef.clear();
                }}
            >
                Erase
            </button>

            <button
                onClick={() => {
                    console.log(
                        canvasRef.toDataURL());
                }}
            >
                GetDataURL
            </button>
            <SignatureCanvas penColor='green'
                canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
                ref={(ref) => { canvasRef = ref }} />

        </div>
    )

}

export default Signature