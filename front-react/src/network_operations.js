import { GET_QUESTIONS, NEW_MEMORY, build_SET_AUDIO_VIDEO, build_NEW_STREAM, build_SET_USER_INFOS, build_TERMINATE_MEMORY, build_SET_USER_SIGNATURE } from './urls';
import axios from 'axios';

const parseQuestions = (response) => {
    // utility function for the questions fields translations between back / front
    const questions = []
    for (const index in JSON.parse(response.data.questions)){
        const fields = JSON.parse(response.data.questions)[index].fields 
        const translatedFields = {
            secondsDuration: fields.duration_in_seconds, 
            value: fields.text, 
            uuid: fields.uuid
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
        console.log("uuid", response.data.uuid)
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
    console.log("fetching")
    axios.get(GET_QUESTIONS)
    .then(function (response) {
        setData(parseQuestions(response))
    })
    .catch(function (error) {
        console.log(error);
    })
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
        console.log(response)
    })
    .catch(function (error) {
        console.error(error);
    })
}

const sendUserInfos = (memoryUUID, form) => {
    axios.post(build_SET_USER_INFOS(memoryUUID), form)
    .then(function (response) {
        console.log(response)
    })
    .catch(function (error) {
        console.error(error);
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
    })
}

const terminateMemory = (memoryUUID, signature) => {
    axios.post(build_TERMINATE_MEMORY(memoryUUID))
    .then(function (response) {
        console.log(response)
    })
    .catch(function (error) {
        console.error(error);
    })
}

export {fetchQuestions, createNewMemoryAndGetUUID, postUseVideo, sendAnswerMedia, sendUserInfos, sendSignature, terminateMemory}