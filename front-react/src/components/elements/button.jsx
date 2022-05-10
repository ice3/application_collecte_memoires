function Button({ label, handleClick }) {
    return (
        <a onClick={handleClick} class="button">{label}</a>
    )
}

export default Button