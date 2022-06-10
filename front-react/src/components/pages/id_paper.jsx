import { ButtonPositive } from "../elements/button";

function FormulairePapier({ handleNextGlobalStep }) {
  return (
    <div className="container">
      <h1>Formulaire papier</h1>
      <div>Merci de vous adresser à l’accueil pour remplir le formulaire.</div>

      <ButtonPositive
        handleClick={() => {
          handleNextGlobalStep();
        }}
      >
        OK
      </ButtonPositive>
    </div>
  );
}

export default FormulairePapier;
