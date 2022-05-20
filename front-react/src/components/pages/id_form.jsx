import React, { useState } from 'react';
import FormulaireNumerique from './id_numeric';
import FormulairePapier from './id_paper';
import UserInfos from "../elements/userInfos";

import { sendUserInfos } from '../../network_operations';

function IdentificationFormSelection({ handleNextGlobalStep, memoryUUID }) {
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

    const notifyBackend = (memoryUUID, isFormulaireNumerique) => {
        console.log(memoryUUID)
        var formData = new FormData();
        formData.append("user_name", userInfos.name)
        formData.append("user_email", userInfos.email)
        formData.append("user_postal_address", userInfos.address)
        formData.append("user_phone", userInfos.phone)
        formData.append("isDigital", isFormulaireNumerique)
        sendUserInfos(memoryUUID, formData)

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


            {isFormulaireChosen ? <Formulaire handleNextGlobalStep={handleNextGlobalStep} userData={userInfos} memoryUUID={memoryUUID}/> :
                allFieldsFilled ? <>
                    <button onClick={() => {
                        setIsFormaulaireNumerique(false)
                        setIsFormulaireChosen(true)
                        notifyBackend(memoryUUID, false)
                    }}>Formulaire papier</button>
                    <button onClick={() => {
                        setIsFormaulaireNumerique(true)
                        setIsFormulaireChosen(true)
                        notifyBackend(memoryUUID, true)
                    }}>Formulaire numérique</button>
                </> : ""
            }

        </>
    )
}

export default IdentificationFormSelection