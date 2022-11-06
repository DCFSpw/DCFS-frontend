import apiConfig from "src/api/apiConfig";

export default {

  initUpload: (data) => apiConfig.post(`/file/request`, data),
  completeUpload: (fileUUID, throwException) => apiConfig.post(
    `/file/request/complete/${fileUUID}`,
    { direction: false },
    { throwException }
  ),
  uploadBlock: (blockUUid, data) => apiConfig.post(`/file/io/${blockUUid}`, data)
}
