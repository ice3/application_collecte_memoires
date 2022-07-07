import { useState } from "react";
import Signature from "../elements/signature";

import { UserInfosDigital } from "../elements/userInfos";
import { sendSignature } from "../../network_operations";
import { ButtonPositive } from "../elements/button";
import { fetchContractConfig } from "../../network_operations";

function FormulaireNumerique({
  handleNextGlobalStep,
  userData,
  memoryUUID,
  userInfos,
  setUserInfos,
  allFieldsFilled,
  notifyBackend,
}) {
  const [markdownTemplate, setMarkdownTemplate] = useState("");
  const [userInfosFilled, setUserInfosFilled] = useState(false);
  const [validated, setValidated] = useState(false);
  const [signed, setSigned] = useState(false);

  let toRender = (
    <UserInfosDigital
      userInfos={userInfos}
      setUserInfos={setUserInfos}
      allFieldsFilled={allFieldsFilled}
      setAllFieldsFilled={setUserInfosFilled}
      notifyBackend={notifyBackend}
    ></UserInfosDigital>
  );

  const signatureClass = validated ? "visible" : "invisible";
  const conditionsClass = !validated ? "visible" : "invisible";

  if (userInfosFilled && !markdownTemplate) {
    fetchContractConfig(userData, setMarkdownTemplate);
  }
  if (markdownTemplate) {
    toRender = (
      <>
        <div
          className="formulaire-consentement"
          dangerouslySetInnerHTML={{ __html: markdownTemplate }}
        ></div>
        <div className="consentement-disclaimer">
          Vous recevrez une copie de ce contrat si votre vidéo est sélectionnée.
        </div>

        <div>
          {!validated ? (
            <div
              className={["side-by-side-centered", conditionsClass].join(" ")}
            >
              <ButtonPositive handleClick={setValidated}>
                J'accepte les conditions
              </ButtonPositive>
            </div>
          ) : (
            <div className="consentement-disclaimer">
              Merci de signer dans le cadre ci dessous.
            </div>
          )}
          <div className={signatureClass}>
            <Signature
              onSaved={(dataUrl) => {
                setTimeout(() => {
                  setSigned(true);
                }, 5);
                sendSignature(memoryUUID, dataUrl);
              }}
            />
          </div>
        </div>
      </>
    );
  }

  if (validated && signed) {
    setTimeout(handleNextGlobalStep, 10);
  }

  return (
    <div>
      <h1>Formulaire numérique</h1>
      {toRender}
    </div>
  );
}

export default FormulaireNumerique;
