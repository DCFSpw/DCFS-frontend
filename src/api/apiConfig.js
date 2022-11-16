import axios from "axios";
import useUserSession from "src/modules/useUserSession";
import {Notify} from "quasar";
import {getJwtErrorCodes} from "src/api/errorCodeEnum";
const AxiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  timeout: 3600_000,
  maxBodyLength: 5000,
  maxContentLength: 5000,

  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
})

const MAX_LOW_PRIORITY_CONCURRENT_REQUESTS = 5

let pendingRequests = 0;

const sleep = ms => new Promise(r => setTimeout(r, ms));

AxiosInstance.interceptors.request.use(
  async request => {
    const userSession = useUserSession()
    if (userSession.isLoggedIn) {
      request.headers.Authorization = `Bearer ${userSession.token}`
    }
    if (request.lowPriority) {
      while (pendingRequests >= MAX_LOW_PRIORITY_CONCURRENT_REQUESTS) {
        await sleep(100)
      }
    }

    pendingRequests++;

    return request
  },
  error => {
    pendingRequests--;
    console.log(error);
    throw error
  }
)

const getResponseData = (response) => {
  const {
    data: { data },
  } = response;
  return data ?? response.data;
}

AxiosInstance.interceptors.response.use(
  response => {
    // if (response.config.responseType === RESPONSE_TYPES.ARRAYBUFFER) return response.data;
    // if (response.data.type === RESPONSE_TYPES.PDF) return response;
    // For now
    pendingRequests--;
    return getResponseData(response)
  },
  async (error) => {

    pendingRequests--;
    if (error.config.hasOwnProperty('throwException') && error.config.throwException === false) {
      return { data: getResponseData(error.response), status: error.response.status}
    }

    console.log(error)

    const errMsg = error.response.data?.message ?? 'Unknown error occurred. Please try again later.'
    const httpCode = error.response.status
    const code = error.response.data?.code ?? '-'

    if (
      httpCode === 401
      && getJwtErrorCodes().includes(code)
    ) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/'
    }

    Notify.create({
      type: 'negative',
      message: errMsg
    })

    throw error
  }
)

export default AxiosInstance
