import React, { useState } from 'react';
import FormulaireNumerique from './id_numeric';
import FormulairePapier from './id_paper';

function IdentificationFormSelection({ handleNextGlobalStep }) {
    const [isFormulaireChosen, setIsFormulaireChosen] = useState(false)
    const [isFormaulaireNumerique, setIsFormaulaireNumerique] = useState(false)


    let Formulaire = undefined
    if (isFormulaireChosen) {
        if (isFormaulaireNumerique) {
            Formulaire = FormulaireNumerique
        } else {

            Formulaire = FormulairePapier
        }

    }

    //  pour le clavier 
    // https://hodgef.com/simple-keyboard/getting-started/react/
    // https://hodgef.com/simple-keyboard/editor/?d=hodgef/simple-keyboard-layouts-demos/tree/french

    return (
        <>
            <div>Choix du formulaire d'identification</div>



            {isFormulaireChosen ? <Formulaire handleNextGlobalStep={handleNextGlobalStep} /> : <>
                <button onClick={() => {
                    setIsFormaulaireNumerique(false)
                    setIsFormulaireChosen(true)
                }}>Formulaire papier</button>
                <button onClick={() => {
                    setIsFormaulaireNumerique(true)
                    setIsFormulaireChosen(true)
                }}>Formulaire numérique</button>
            </>
            }

        </>
    )
}

export default IdentificationFormSelection