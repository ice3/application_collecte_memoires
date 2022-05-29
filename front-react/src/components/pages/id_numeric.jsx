import NextStepButton from "../elements/nextStepButton";
import { marked } from "marked";
import { useEffect, useState } from "react";
import Signature from "../elements/signature";
import Handlebars from "handlebars/dist/cjs/handlebars";

import { UserInfosDigital } from "../elements/userInfos";
import { sendSignature } from "../../network_operations";
import { ButtonNeutral, ButtonPositive } from "../elements/button";

const hydrateContract = (userData, setMarkdownTemplate) => {
  const readmePath = require("../../documents/formulaire_consentement.md");

  fetch(readmePath)
    .then((response) => {
      return response.text();
    })
    .then((text) => {
      const now = new Date();
      const date = now.toISOString().split("T")[0];

      const template = Handlebars.compile(text);
      const hydrated_text = template({
        name: userData.name,
        address: userData.address,
        phone: userData.phone,
        email: userData.email,
        lieu: userData.lieu,
        date: date,
      });
      setMarkdownTemplate(marked(hydrated_text));
    });
};

function FormulaireNumerique({
  handleNextGlobalStep,
  userData,
  memoryUUID,
  userInfos,
  setUserInfos,
  allFieldsFilled,
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
    ></UserInfosDigital>
  );

  const signatureClass = validated ? "visible" : "invisible";
  const conditionsClass = !validated ? "visible" : "invisible";

  if (userInfosFilled) {
    hydrateContract(userData, setMarkdownTemplate);
    toRender = (
      <>
        <div
          class="formulaire-consentement"
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
                setSigned(true);
                sendSignature(memoryUUID, dataUrl);
              }}
            />
          </div>
        </div>
      </>
    );
  }

  if (validated && signed) {
    handleNextGlobalStep();
  }

  return (
    <div>
      <h1>Formulaire numérique</h1>
      {toRender}
    </div>
  );
}

export default FormulaireNumerique;
