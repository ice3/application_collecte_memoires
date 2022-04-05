import NextStepButton from "../elements/nextStepButton"

function FormulaireNumerique({ handleNextGlobalStep }) {
    return (
        <div>
            Formulaire numérique
            <NextStepButton handleNext={handleNextGlobalStep} label="Etape suivante" />

        </div>
    )
}

export default FormulaireNumerique