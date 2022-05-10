
function NextStepButton({ handleNext, label }) {
    return (
        <a onClick={handleNext} class="button">{label}</a>
    )
}

export default NextStepButton