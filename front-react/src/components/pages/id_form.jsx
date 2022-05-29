import React, { useState } from "react";
import FormulaireNumerique from "./id_numeric";
import FormulairePapier from "./id_paper";
import { UserInfosCommon, UserInfosDigital } from "../elements/userInfos";
import { ButtonNeutral, ButtonPositive } from "../elements/button";

import { sendUserInfos } from "../../network_operations";

function IdentificationFormSelection({ handleNextGlobalStep, memoryUUID }) {
  const [isFormulaireChosen, setIsFormulaireChosen] = useState(false);
  const [isFormulaireNumerique, setIsFormulaireNumerique] = useState(false);
  const [userInfos, setUserInfos] = useState({});
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);

  let Formulaire = undefined;
  if (isFormulaireChosen) {
    if (isFormulaireNumerique) {
      Formulaire = FormulaireNumerique;
    } else {
      Formulaire = FormulairePapier;
    }
  }

  const notifyBackend = (memoryUUID, isFormulaireNumerique) => {
    console.log(memoryUUID);
    var formData = new FormData();
    formData.append("user_name", userInfos.name);
    formData.append("user_email", userInfos.email);
    formData.append("user_postal_address", userInfos.address);
    formData.append("user_phone", userInfos.phone);
    formData.append("isDigital", isFormulaireNumerique);
    sendUserInfos(memoryUUID, formData);
  };

  const buttonClass =
    !isFormulaireChosen & allFieldsFilled ? "visible" : "invisible";

  return (
    <div className="container">
      {isFormulaireChosen ? (
        ""
      ) : (
        <>
          <h1>Choix du formulaire d'identification</h1>
          <div>Merci d'entrer ces informations personnelles</div>
        </>
      )}

      {isFormulaireChosen ? (
        ""
      ) : (
        <UserInfosCommon
          userInfos={userInfos}
          setUserInfos={setUserInfos}
          allFieldsFilled={allFieldsFilled}
          setAllFieldsFilled={setAllFieldsFilled}
        >
          <div className="w70">
            <div className={["side-by-side-centered", buttonClass].join(" ")}>
              <ButtonNeutral
                handleClick={() => {
                  setIsFormulaireNumerique(false);
                  setIsFormulaireChosen(true);
                  notifyBackend(memoryUUID, false);
                }}
              >
                Formulaire papier
              </ButtonNeutral>
              <ButtonNeutral
                handleClick={() => {
                  setIsFormulaireNumerique(true);
                  setIsFormulaireChosen(true);
                  notifyBackend(memoryUUID, true);
                }}
              >
                Formulaire numérique
              </ButtonNeutral>
            </div>
          </div>
        </UserInfosCommon>
      )}

      {isFormulaireChosen ? (
        <Formulaire
          userInfos={userInfos}
          setUserInfos={setUserInfos}
          allFieldsFilled={allFieldsFilled}
          setAllFieldsFilled={setAllFieldsFilled}
          handleNextGlobalStep={handleNextGlobalStep}
          userData={userInfos}
          memoryUUID={memoryUUID}
          notifyBackend={notifyBackend(memoryUUID, isFormulaireNumerique)}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default IdentificationFormSelection;
