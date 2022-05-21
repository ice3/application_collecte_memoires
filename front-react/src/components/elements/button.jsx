function Button({ children, handleClick, extraClass }) {
    return (
        <button className={["button", extraClass].join(" ")} onClick={handleClick}>{children}</button>
    )
}

function ButtonNeutral({ children, handleClick}) {
    return <Button extraClass="btn-neutral" handleClick={handleClick}>{children}</Button>
}

function ButtonPositive({ children, handleClick}) {
    return <Button extraClass="btn-positive" handleClick={handleClick}>{children}</Button>
}

function ButtonNegative({ children, handleClick}) {
    return <Button extraClass="btn-negative" handleClick={handleClick}>{children}</Button>
}

export {ButtonNeutral, ButtonNegative, ButtonPositive, Button} 