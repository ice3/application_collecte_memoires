import React, { useState } from 'react';
import FormulaireNumerique from './id_numeric';
import FormulairePapier from './id_paper';
import UserInfos from "../elements/userInfos";

function IdentificationFormSelection({ handleNextGlobalStep }) {
    const [isFormulaireChosen, setIsFormulaireChosen] = useState(false)
    const [isFormaulaireNumerique, setIsFormaulaireNumerique] = useState(false)
    const [userInfos, setUserInfos] = useState({})
    const [allFieldsFilled, setAllFieldsFilled] = useState(false)

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
            <h1>Choix du formulaire d'identification</h1>

            {isFormulaireChosen ? "" :
                <UserInfos
                    userInfos={userInfos}
                    setUserInfos={setUserInfos}
                    allFieldsFilled={allFieldsFilled}
                    setAllFieldsFilled={setAllFieldsFilled}
                />
            }


            {isFormulaireChosen ? <Formulaire handleNextGlobalStep={handleNextGlobalStep} userData={userInfos} /> :
                allFieldsFilled ? <>
                    <button onClick={() => {
                        setIsFormaulaireNumerique(false)
                        setIsFormulaireChosen(true)
                    }}>Formulaire papier</button>
                    <button onClick={() => {
                        setIsFormaulaireNumerique(true)
                        setIsFormulaireChosen(true)
                    }}>Formulaire numérique</button>
                </> : ""
            }

        </>
    )
}

export default IdentificationFormSelection