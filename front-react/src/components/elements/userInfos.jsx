import React, { useState, useRef } from "react";
import FrenchKeyboard from "../elements/keyboard";
import { ButtonNeutral, ButtonPositive } from "../elements/button";

function UserInfosCommon({
  userInfos,
  setUserInfos,
  allFieldsFilled,
  setAllFieldsFilled,
  children,
}) {
  const [inputName, setInputName] = useState("name");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const keyboard = useRef();

  const inputs = userInfos;
  const setInputs = setUserInfos;

  const onChangeAll = (inputs) => {
    checkAllFilled(["name", "email"]);
    setInputs({ ...inputs });
    checkEmail("email");
  };

  const onChangeInput = (event) => {
    checkAllFilled(["name", "email"]);
    checkEmail("email");
    const inputVal = event.target.value;

    setInputs({
      ...inputs,
      [inputName]: inputVal,
    });

    keyboard.current.setInput(inputVal);
  };

  const getInputValue = (inputName) => {
    return inputs[inputName] || "";
  };

  const checkEmail = (fieldName) => {
    if (inputs[fieldName] === undefined) {
      setIsEmailValid(true);
      return;
    }
    if (inputs[fieldName] === "") {
      setIsEmailValid(true);
      return;
    }
    const email = inputs[fieldName];
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/;
    setIsEmailValid(re.test(email));
    console.log(email, re.test(email));
    return re.test(email);
  };

  const checkAllFilled = (fieldNames) => {
    let allFilled = true;
    for (const index in fieldNames) {
      const fieldName = fieldNames[index];
      let length = 0;
      if (inputs && inputs[fieldName] && inputs[fieldName].length) {
        length = inputs[fieldName].length;
      }
      allFilled = allFilled && length > 0;
    }
    allFilled = allFilled && checkEmail("email");
    setAllFieldsFilled(allFilled);
  };

  const displayErrorEmail = !isEmailValid ? "visible" : "invisible";

  return (
    <>
      <div
        className="userForm-infos"
        key={`${displayErrorEmail}-${allFieldsFilled}`}
      >
        <label>
          <span>Nom et prénom :</span>
          <input
            type="text"
            id="name"
            value={getInputValue("name")}
            onFocus={() => setInputName("name")}
            placeholder="Camille Martin"
            autoComplete="off"
            onChange={onChangeInput}
          />
        </label>
        <label>
          <span>Courriel :</span>
          <input
            type="email"
            id="email"
            onChange={onChangeInput}
            value={getInputValue("email")}
            onFocus={() => setInputName("email")}
            placeholder={"moi@exemple.com"}
            autoComplete="off"
          />
        </label>
        <span className={["input-error", displayErrorEmail].join(" ")}>
          {inputs["email"]} n'est pas un courriel valide
        </span>
      </div>

      {children}

      <FrenchKeyboard
        inputs={userInfos}
        setInputs={setUserInfos}
        allFieldsFilled={allFieldsFilled}
        setAllFieldsFilled={setAllFieldsFilled}
        keyboardRef={keyboard}
        onChangeAll={onChangeAll}
        inputName={inputName}
      ></FrenchKeyboard>
    </>
  );
}

function UserInfosDigital({
  userInfos,
  setUserInfos,
  allFieldsFilled,
  setAllFieldsFilled,
  notifyBackend,
}) {
  const [inputName, setInputName] = useState("phone");
  const [internalAllFilled, setInternalAllFilled] = useState(false);
  const keyboard = useRef();

  const inputs = userInfos;
  const setInputs = setUserInfos;

  const onChangeAll = (inputs) => {
    /**
     * Here we spread the inputs into a new object
     * If we modify the same object, react will not trigger a re-render
     */
    checkAllFilled(["phone", "address"]);
    // we need to merge the input to the previous (to keep the previous fields)
    setInputs({ ...userInfos, ...inputs });
  };

  const onChangeInput = (event) => {
    checkAllFilled(["phone", "address"]);
    const inputVal = event.target.value;
    setInputs({
      ...inputs,
      [inputName]: inputVal,
    });

    keyboard.current.setInput(inputVal);
  };

  const getInputValue = (inputName) => {
    return inputs[inputName] || "";
  };

  const checkAllFilled = (fieldNames) => {
    let allFilled = true;
    for (const index in fieldNames) {
      const fieldName = fieldNames[index];
      let length = 0;
      if (inputs && inputs[fieldName] && inputs[fieldName].length) {
        length = inputs[fieldName].length;
      }
      allFilled = allFilled && length > 0;
    }
    setInternalAllFilled(allFilled);
  };

  const buttonClass = internalAllFilled ? "visible" : "invisible";

  return (
    <>
      <div className="userForm-infos">
        <label>
          <span>Téléphone :</span>
          <input
            type="text"
            id="phone"
            onChange={onChangeInput}
            value={getInputValue("phone")}
            onFocus={() => setInputName("phone")}
            placeholder={"06 25 24 63 06"}
            autoComplete="off"
          />
        </label>
        <label>
          <span> Adresse :</span>

          <textarea
            type="text"
            id="address"
            onChange={onChangeInput}
            value={getInputValue("address")}
            onFocus={() => setInputName("address")}
            placeholder="12 rue des fleurs, Paris"
            autoComplete="off"
          ></textarea>
        </label>
      </div>

      <div className={["side-by-side-centered", buttonClass].join(" ")}>
        <ButtonPositive
          handleClick={() => {
            setAllFieldsFilled(true);
            notifyBackend();
          }}
        >
          Valider
        </ButtonPositive>
      </div>

      <FrenchKeyboard
        inputs={userInfos}
        setInputs={setUserInfos}
        allFieldsFilled={allFieldsFilled}
        setAllFieldsFilled={setAllFieldsFilled}
        keyboardRef={keyboard}
        onChangeAll={onChangeAll}
        inputName={inputName}
      ></FrenchKeyboard>
    </>
  );
}

export { UserInfosCommon, UserInfosDigital };
