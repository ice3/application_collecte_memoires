import React, { useState } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import french from "simple-keyboard-layouts/build/layouts/french";

function FrenchKeyboard({ inputName, keyboardRef, onChangeAll, children }) {
  const [layoutName, setLayoutName] = useState("default");
  const [isCaps, setIsCaps] = useState(false);

  const onKeyPress = (button) => {
    if (!isCaps) {
      setLayoutName("default");
    }

    /**
     * If you want to handle the shift and caps lock buttons
     */
    /**
     * Shift functionality
     */
    if (button === "{shift}") handleShift();

    /**
     * Caps functionality
     */
    if (button === "{lock}") handleCaps();
  };

  const handleShift = () => {
    setLayoutName(layoutName === "default" ? "shift" : "default");
    setIsCaps(false);
  };

  const handleCaps = () => {
    setLayoutName(layoutName === "default" ? "shift" : "default");
    setIsCaps(!isCaps);
  };

  return (
    <div className="user-infos-form">
      <Keyboard
        layoutName={layoutName}
        onKeyPress={onKeyPress}
        display={{
          "{bksp}": "Retour ⌫",
          "{enter}": "Entrée ↵",
          "{space}": "Espace",
          "{tab}": "tab ⇥",
          "{lock}": "Maj Ver ⇪",
          "{shift}": "Maj ⇧",
        }}
        keyboardRef={(r) => (keyboardRef.current = r)}
        inputName={inputName}
        onChangeAll={onChangeAll}
        newLineOnEnter={true}
        {...french}
      />
      <div className="fake-keyboard"></div>
    </div>
  );
}

export default FrenchKeyboard;
