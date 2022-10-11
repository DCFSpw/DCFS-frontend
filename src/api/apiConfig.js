import axios from "axios";
import useUserSession from "src/modules/useUserSession";
import {Notify} from "quasar";
import {ErrorCodeEnum, getJwtErrorCodes} from "src/api/errorCodeEnum";
const AxiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  timeout: 10000,
  maxBodyLength: 5000,
  maxContentLength: 5000,

  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
})

AxiosInstance.interceptors.request.use(
  request => {
    const userSession = useUserSession()
    if (userSession.isLoggedIn) {
      request.headers.Authorization = `${userSession.token}`
    }
    return request
  },
  error => {
    console.log(error);
    throw error
  }
)

AxiosInstance.interceptors.response.use(
  response => {
    // if (response.config.responseType === RESPONSE_TYPES.ARRAYBUFFER) return response.data;
    // if (response.data.type === RESPONSE_TYPES.PDF) return response;
    // For now
    const {
      data: { data },
    } = response;
    return data ?? response.data;
  },
  async (error) => {
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

    console.log(error);
    throw error
  }
)

export default AxiosInstance
