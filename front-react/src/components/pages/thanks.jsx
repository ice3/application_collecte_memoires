import { terminateMemory } from "../../network_operations"

function Thanks({memoryUUID}) {
    terminateMemory(memoryUUID)
    return (
        <div>Merci pour votre participation</div>
    )
}

export default Thanks