
import FrenchKeyboard from "../elements/keyboard";

function UserInfos({ userInfos, setUserInfos, allFieldsFilled, setAllFieldsFilled }) {
    return (
        <>
            <FrenchKeyboard 
                inputs={userInfos} 
                setInputs={setUserInfos} 
                allFieldsFilled={allFieldsFilled}
                setAllFieldsFilled={setAllFieldsFilled}
            />
        </>
    );
}



export default UserInfos