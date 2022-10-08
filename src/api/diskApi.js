import apiConfig from "src/api/apiConfig";

export default {
  create: (data) => apiConfig.post('/disks/manage', data),
  oauth: (diskUuid, data) => apiConfig.post(`/disks/oauth/${diskUuid}`, data),
}
