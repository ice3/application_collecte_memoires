import { terminateMemory } from "../../network_operations";

function Thanks({ memoryUUID }) {
  terminateMemory(memoryUUID);
  return <img src="/photos/remerciements.png" alt="image" />;
}

export default Thanks;
