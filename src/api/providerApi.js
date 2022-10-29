import apiConfig from "src/api/apiConfig";

export default {
  index: () => apiConfig.get(`/providers`),
}
