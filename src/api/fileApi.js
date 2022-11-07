import apiConfig from "src/api/apiConfig";

export default {

  initUpload: (data) => apiConfig.post(`/files/upload`, data),
  completeUpload: (fileUUID, throwException) => apiConfig.post(
    `/files/upload/${fileUUID}`,
    {},
    { throwException }
  ),
  uploadBlock: (blockUUid, data) => apiConfig.post(`/files/block/${blockUUid}`, data)
}
