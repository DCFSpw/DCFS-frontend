import apiConfig from "src/api/apiConfig";

export default {
  index: (params) => apiConfig.get(`/files/manage`, { params }),
  show: (fileUuid) => apiConfig.get(`/files/manage/${fileUuid}`),
  update: (fileUuid,  data) => apiConfig.put(`/files/manage/${fileUuid}`, data),
  initUpload: (data) => apiConfig.post(`/files/upload`, data),
  completeUpload: (fileUUID, throwException) => apiConfig.post(
    `/files/upload/${fileUUID}`,
    {},
    { throwException }
  ),
  uploadBlock: (blockUUid, data) => apiConfig.post(`/files/block/${blockUUid}`, data)
}
