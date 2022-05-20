
import NextStepButton from "../elements/nextStepButton"
import { marked } from "marked";
import { useEffect, useState } from "react";
import Signature from "../elements/signature";
import Handlebars from 'handlebars/dist/cjs/handlebars';

import { sendSignature } from "../../network_operations";

function FormulaireNumerique({ handleNextGlobalStep, userData, memoryUUID }) {
    const [markdownTemplate, setMarkdowntemplate] = useState('')
    const [validated, setValidated] = useState(false)
    const [signed, setSigned] = useState(false)
    useEffect(() => {
        const readmePath = require("../../documents/formulaire_consentement.md");

        fetch(readmePath).then(response => {
            return response.text()
        }).then(text => {
            const now = new Date()
            const date = now.toISOString().split('T')[0]

            const template = Handlebars.compile(text)
            const hydrated_text = template({
                name: userData.name,
                address: userData.address,
                phone: userData.phone,
                email: userData.email,
                lieu: userData.lieu,
                date: date
            })
            setMarkdowntemplate(marked(hydrated_text))
        })
    }, []
    )


    return (
        <div>
            <h1>
                Formulaire numérique
            </h1>

            {console.log(markdownTemplate)}
            <div class="formulaire-consentement" dangerouslySetInnerHTML={{ __html: markdownTemplate }}>
            </div>

            <button onClick={event => setValidated(true)}>En cliquant ici j'accepte les conditions proposées</button>
            <Signature onSaved={(dataUrl) => {
                setSigned(true);
                sendSignature(memoryUUID, dataUrl)
            }} />

            {validated && signed ? <NextStepButton handleNext={handleNextGlobalStep} label="Etape suivante" /> : ""}

        </div >
    )
}

export default FormulaireNumerique