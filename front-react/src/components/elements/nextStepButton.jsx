
function NextStepButton({ handleNext, label, extraClass }) {
    return (
        <button className={["button", extraClass].join(" ")}  onClick={handleNext} >{label}</button>
    )
}

export default NextStepButton