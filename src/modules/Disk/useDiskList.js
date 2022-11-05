import usePaginatedList from "src/modules/usePaginatedList.js";
import diskApi from "src/api/diskApi.js";

export default function() {
  const { isLoading, data, page, getData, isEmpty } = usePaginatedList()

  const getDisks = (cfg = {}) => getData(diskApi.index, cfg)

  return {
    isLoading,
    data,
    page,
    isEmpty,
    getDisks
  }
}
