import { BASE_URL, GET_QUESTIONS, NEW_MEMORY,GET_CONTRACT_CONFIG, build_SET_AUDIO_VIDEO, build_NEW_STREAM, build_SET_USER_INFOS, build_TERMINATE_MEMORY, build_SET_USER_SIGNATURE } from './urls';
import axios from 'axios';
import Handlebars from "handlebars/dist/cjs/handlebars";
import { marked } from 'marked';
import { toast } from "react-toastify";

const hydrateContract = (text, userData, location) => {
    const now = new Date();
    const date = now.toISOString().split("T")[0];
  
    const template = Handlebars.compile(text);
    const hydrated_text = template({
      name: userData.name,
      address: userData.address,
      phone: userData.phone,
      email: userData.email,
      lieu: location,
      date: date,
    });
    return hydrated_text;
  };
  

const parseQuestions = (response) => {
    // utility function for the questions fields translations between back / front
    const questions = []
    for (const index in JSON.parse(response.data.questions)){
        const fields = JSON.parse(response.data.questions)[index].fields 
        const translatedFields = {
            secondsDuration: fields.duration_in_seconds, 
            value: fields.text, 
            uuid: fields.uuid, 
            voiceover: `${BASE_URL}/media/${fields.voiceover}`,
            voiceoverOrig: fields.voiceover,
            secondsBeforeRecord: fields.start_delay_in_seconds
        }
        questions.push(translatedFields)
    }
    return questions
}

const createNewMemoryAndGetUUID = (setData) => {
    // tells the backend to create a new memory (set of recording + user infos)
    // and set the memoryUUID for future use
    axios.post(NEW_MEMORY)
    .then(function (response) {
        setData(response.data.uuid)
    })
    .catch(function (error) {
        console.log(error);
    })
}

const postUseVideo = (useVideo, memoryUUID) => {
    // send to the backend the choice for audio / video
    axios.post(build_SET_AUDIO_VIDEO(memoryUUID), {video: useVideo})
    .then(function (response) {
        console.log(response)
    })
    .catch(function (error) {
        console.log(error);
    })
}


const fetchQuestions = (setData) => {
    // get the question list (already sorted) from the backend
    axios.get(GET_QUESTIONS)
    .then(function (response) {
        setData(parseQuestions(response))
    })
    .catch(function (error) {
        console.log(error);
    })
}

const fetchContractConfig = (userData, setData) => {
    axios.get(GET_CONTRACT_CONFIG)
    .then((response) => {
      return response.data
    })
    .then((data) => {
      const text = data.html_contract;
      const location = data.location;
      const hydrated_text = hydrateContract(text, userData, location);
      setData(marked(hydrated_text));
    });

}

const sendAnswerMedia = (memoryUUID, questionUUID, mediaBlob) => {
    // the the binary blob to the back
    const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

    var formData = new FormData();
    formData.append('media', mediaBlob);
    axios.post(build_NEW_STREAM(memoryUUID, questionUUID), formData, config)
    .then(function (response) {
        toast.success("Réponse soumise");
    })
    .catch(function (error) {
        console.log(error)
        toast.error(`Erreur envoie réponse ${error}`, {autoClose: 10000});
    })
}

const sendUserInfos = (memoryUUID, form) => {
    axios.post(build_SET_USER_INFOS(memoryUUID), form)
    .then(function (response) {
        console.log(response)
    })
    .catch(function (error) {
        console.error(error);
        toast.error(`Erreur envoie informations utilisateur ${error}`, {autoClose: 10000});
    })
}

const sendSignature = (memoryUUID, signature) => {
    const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

    var formData = new FormData();
    formData.append('signature', signature);
    axios.post(build_SET_USER_SIGNATURE(memoryUUID), formData, config)
    .then(function (response) {
        console.log(response)
    })
    .catch(function (error) {
        console.error(error);
        toast.error(`Erreur envoie signature ${error}`, {autoClose: 10000});
    })
}

const terminateMemory = (memoryUUID, signature) => {
    axios.post(build_TERMINATE_MEMORY(memoryUUID))
    .then(function (response) {
        console.log(response)
    })
    .catch(function (error) {
        console.error(error);
        toast.error(`Erreur conclusion ${error}`, {autoClose: 10000});
    })
}

export {fetchQuestions, fetchContractConfig, createNewMemoryAndGetUUID, postUseVideo, sendAnswerMedia, sendUserInfos, sendSignature, terminateMemory}