function NextStepButton({ handleNext, label }) {
    return (
        <button onClick={handleNext}>{label}</button>
    )
}

export default NextStepButton