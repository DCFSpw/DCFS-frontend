import apiConfig from "src/api/apiConfig";

export default {
  index: (params) => apiConfig.get(`/files/manage`, { params }),
  show: (fileUuid) => apiConfig.get(`/files/manage/${fileUuid}`),
  create: (data) => apiConfig.post(`/files/manage`, data),
  update: (fileUuid,  data) => apiConfig.put(`/files/manage/${fileUuid}`, data),
  delete: (fileUuid) => apiConfig.delete(`/files/manage/${fileUuid}`),

  initUpload: (data) => apiConfig.post(`/files/upload`, data, { lowPriority: true }),
  completeUpload: (fileUUID, throwException) => apiConfig.post(
    `/files/upload/${fileUUID}`,
    {},
    { throwException, lowPriority: true }
  ),
  uploadBlock: (blockUuid, data) => apiConfig.post(`/files/block/${blockUuid}`, data, { lowPriority: true }),

  downloadFile: (fileUuid) => apiConfig.post(`/files/download/${fileUuid}`),
  downloadBlock: (blockUuid, fileUuid) => apiConfig.post(`/files/blockd/${fileUuid}`, { fileUUID: fileUuid } ),
  completeDownload: (fileUuid) => apiConfig.post(`/files/upload/${fileUuid}`)
}
