import apiConfig from "src/api/apiConfig";

export default {
  index: (params) => apiConfig.get(`/disks/manage`, { params }),
  create: (data) => apiConfig.post(`/disks/manage`, data),
  oauth: (diskUuid, data) => apiConfig.post(`/disks/oauth/${diskUuid}`, data),
  update: (uuid, data) => apiConfig.put(`/disks/manage/${uuid}`, data),
  delete: (uuid) => apiConfig.delete(`/disks/manage/${uuid}`),
  replace: (uuid) => apiConfig.delete(`/disks/backup/${uuid}`),
};
