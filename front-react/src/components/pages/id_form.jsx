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