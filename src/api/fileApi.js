import apiConfig from "src/api/apiConfig";

export default {
  index: (params) => apiConfig.get(`/files/manage`, { params }),
  show: (fileUuid) => apiConfig.get(`/files/manage/${fileUuid}`),
  create: (data) => apiConfig.post(`/files/manage`, data),
  update: (fileUuid,  data) => apiConfig.put(`/files/manage/${fileUuid}`, data),
  delete: (fileUuid) => apiConfig.delete(`/files/manage/${fileUuid}`),

  initUpload: (data) => apiConfig.post(`/files/upload`, data),
  completeUpload: (fileUUID, throwException) => apiConfig.post(
    `/files/upload/${fileUUID}`,
    {},
    { throwException }
  ),
  uploadBlock: (blockUUid, data) => apiConfig.post(`/files/block/${blockUUid}`, data)
}
