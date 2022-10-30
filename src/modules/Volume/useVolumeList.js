import volumeApi from "src/api/volumeApi";
import usePaginatedList from "src/modules/usePaginatedList.js";

export default function() {
  const { isLoading, data, page, getData, isEmpty } = usePaginatedList()

  const getVolumes = (cfg = {}) => getData(volumeApi.index, cfg)

  return {
    isLoading,
    data,
    page,
    getVolumes,
    isEmpty
  }
}
