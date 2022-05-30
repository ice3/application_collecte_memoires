const BASE_URL = "http://127.0.0.1:8000"
const GET_QUESTIONS = `${BASE_URL}/memories/questions/`
const GET_CONTRACT_CONFIG = `${BASE_URL}/memories/contract-config/`
const NEW_MEMORY = `${BASE_URL}/memories/new-memory/`
const build_SET_AUDIO_VIDEO = uid => `${BASE_URL}/memories/${uid}/audio-video/`
const build_NEW_STREAM = (memoryUUID, questionUUID) => `${BASE_URL}/memories/${memoryUUID}/questions/${questionUUID}/`
const build_SET_USER_INFOS = uid => `${BASE_URL}/memories/${uid}/user-infos/`
const build_SET_USER_SIGNATURE = uid => `${BASE_URL}/memories/${uid}/user-signature/`
const build_TERMINATE_MEMORY = uid => `${BASE_URL}/memories/${uid}/terminate/`

export {BASE_URL, GET_QUESTIONS, GET_CONTRACT_CONFIG, NEW_MEMORY, build_SET_AUDIO_VIDEO, build_NEW_STREAM, build_SET_USER_INFOS, build_SET_USER_SIGNATURE, build_TERMINATE_MEMORY}