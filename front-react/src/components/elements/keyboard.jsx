import React, { useState, useRef } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import french from "simple-keyboard-layouts/build/layouts/french";



function FrenchKeyboard({ inputs, setInputs, allFieldsFilled, setAllFieldsFilled }) {
    const [inputName, setInputName] = useState("firstName");
    const [layoutName, setLayoutName] = useState("default");
    const [isCaps, setIsCaps] = useState(false);
    const keyboard = useRef();

    const onChangeAll = inputs => {
        /**
         * Here we spread the inputs into a new object
         * If we modify the same object, react will not trigger a re-render
         */
        setInputs({ ...inputs });
        console.log("Inputs changed", inputs);
    };

    const onChangeInput = event => {
        const inputVal = event.target.value;

        setInputs({
            ...inputs,
            [inputName]: inputVal
        });

        console.log("all filled", allFieldsFilled)
        keyboard.current.setInput(inputVal);
    };

    const getInputValue = inputName => {
        return inputs[inputName] || "";
    };


    const onKeyPress = (button) => {
        if (!isCaps) {
            setLayoutName("default")
        }
        console.log(inputs["name"] && inputs["address"] && inputs["phone"] && inputs["email"])
        setAllFieldsFilled(inputs["name"] && inputs["address"] && inputs["phone"] && inputs["email"])

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
        console.log(layoutName)
        setLayoutName(layoutName === "default" ? "shift" : "default")
        setIsCaps(false)
    };

    const handleCaps = () => {
        console.log(layoutName)
        setLayoutName(layoutName === "default" ? "shift" : "default")
        setIsCaps(!isCaps)
    }

    return (
        <div className="App">
            <div>
                <label>
                    Nom et prénom :
                    <input
                        type="text"
                        id="name"
                        value={getInputValue("name")}
                        onFocus={() => setInputName("name")}
                        placeholder={"Name"}
                        onChange={onChangeInput}

                    />
                </label>
            </div>

            <div>
                <label>
                    Adresse :
                    <input
                        type="text"
                        id="address"
                        onChange={onChangeInput}
                        value={getInputValue("address")}
                        onFocus={() => setInputName("address")}
                        placeholder={"Adresse"}
                    />
                </label>
            </div>
            <div>
                <label>
                    Téléphone :
                    <input
                        type="text"
                        id="phone"
                        onChange={onChangeInput}
                        value={getInputValue("phone")}
                        onFocus={() => setInputName("phone")}
                        placeholder={"Téléphone"}
                    />
                </label>
            </div>
            <div>
                <label>
                    Courriel :
                    <input
                        type="text"
                        id="email"
                        onChange={onChangeInput}
                        value={getInputValue("email")}
                        onFocus={() => setInputName("email")}
                        placeholder={"Courriel"}

                    />
                </label>
            </div>


            <Keyboard
                layoutName={layoutName}
                onKeyPress={onKeyPress}
                display={{
                    '{bksp}': 'Retour ⌫',
                    "{enter}": "Entrée ↵",
                    '{space}': 'Espace',
                    "{tab}": "tab ⇥",
                    "{lock}": "Maj Ver ⇪",
                    "{shift}": "Maj ⇧",
                }}
                keyboardRef={r => (keyboard.current = r)}
                inputName={inputName}
                onChangeAll={onChangeAll}

                {...french}
            />

        </div >
    );
}


export default FrenchKeyboard

