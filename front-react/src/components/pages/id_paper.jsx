import NextStepButton from "../elements/nextStepButton"

function FormulairePapier({ handleNextGlobalStep }) {
    return (
        <div>
            Formulaire papier
            <NextStepButton handleNext={handleNextGlobalStep} label="Etape suivante" />
        </div>
    )
}

export default FormulairePapier