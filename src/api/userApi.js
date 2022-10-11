import apiConfig from "src/api/apiConfig";

export default {
  showProfile: () => apiConfig.get('/user/profile'),
  updateProfile: (data) => apiConfig.put('/user/profile', data),
  changePassword: (data) => apiConfig.put('/user/password', data),
}
