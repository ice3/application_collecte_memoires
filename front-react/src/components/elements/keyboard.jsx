import React, { useState } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

const frenchLayout = {
  layout: {
    default: [
      "` 1 2 3 4 5 6 7 8 9 0 \u00B0 + {bksp}",
      "{tab} a z e r t y u i o p ^ $",
      "{lock} q s d f g h j k l m \u00F9 * {enter}",
      "{shift} < w x c v b n . ; : ! {shift}",
      "@ {space}",
    ],
    shift: [
      "\u00B2 & \u00E9 \" ' ( - \u00E8 _ \u00E7 \u00E0 ) = {bksp}",
      "{tab} A Z E R T Y U I O P \u00A8 \u00A3",
      "{lock} Q S D F G H J K L M % \u00B5 {enter}",
      "{shift} > W X C V B N ? , / \u00A7 {shift}",
      "@ {space}",
    ],
  },
};

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
        {...frenchLayout}
      />
      <div className="fake-keyboard"></div>
    </div>
  );
}

export default FrenchKeyboard;
