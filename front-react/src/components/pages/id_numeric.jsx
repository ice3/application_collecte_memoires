
import NextStepButton from "../elements/nextStepButton"
import { marked } from "marked";
import { useEffect, useState } from "react";
import Signature from "../elements/signature";

function FormulaireNumerique({ handleNextGlobalStep }) {
    const [markdownTemplate, setMarkdowntemplate] = useState('')
    useEffect(() => {
        const readmePath = require("../../documents/formulaire_consentement.md");

        fetch(readmePath).then(response => {
            return response.text()
        }).then(text => {
            setMarkdowntemplate(marked(text))
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

            <button>En cliquant ici j'accepte les conditions proposées</button>
            <Signature />

            <NextStepButton handleNext={handleNextGlobalStep} label="Etape suivante" />

        </div >
    )
}

export default FormulaireNumerique