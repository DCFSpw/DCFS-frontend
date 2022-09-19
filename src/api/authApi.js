import apiConfig from "src/api/apiConfig";

export default {
  login: (data) => apiConfig.post('/auth/login', data),
  register: (data) => apiConfig.post('/auth/register', data),
}
