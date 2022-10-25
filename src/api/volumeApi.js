import apiConfig from "src/api/apiConfig";

export default {
  index: (params) => apiConfig.get(`/volumes/manage`, { params }),
  update: (uuid, data) => apiConfig.put(`/volumes/manage/${uuid}`, data),
  create: (data) => apiConfig.post(`/volumes/manage`, data),
  delete: (uuid) => apiConfig.delete(`/volumes/manage/${uuid}`),
}
