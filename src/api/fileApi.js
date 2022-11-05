import apiConfig from "src/api/apiConfig";

export default {

  initUpload: (data) => apiConfig.post(`/file/request`, data),
  completeUpload: (fileUUID) => apiConfig.post(`/file/request/complete/${fileUUID}`, { direction: false }),
  uploadBlock: (blockUUid, data) => apiConfig.post(`/file/io/${blockUUid}`, data)
}
