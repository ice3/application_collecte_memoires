import { terminateMemory } from "../../network_operations";
import { ButtonPositive } from "../elements/button";

function Thanks({ memoryUUID, mediaPath }) {
  terminateMemory(memoryUUID);
  return (
    <div className="container">
      <img src={mediaPath} alt="thanks - conclusion" />
      <ButtonPositive handleClick={() => window.location.reload()}>
        Revenir à l'accueil
      </ButtonPositive>
    </div>
  );
}

export default Thanks;
