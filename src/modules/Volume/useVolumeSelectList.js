import {ref} from "vue";
import useVolumeList from "src/modules/Volume/useVolumeList";
import volumeApi from "src/api/volumeApi.js";

export default function() {
  const {isLoading, data: list, getVolumes, page} = useVolumeList()
  const data = ref([])
  const totalPages = ref(1)

  const loadVolumes = async ({ to } = {}) => {
    const lastIndex = data.value.length - 1

    if (page.value > totalPages.value || lastIndex !== to) {
      return
    }

    await getVolumes()
    data.value = [...data.value, ...list.value.data]
    page.value++;
  }

  const initialLoadVolumes = async () => {
    page.value = 1;
    await loadVolumes({ to: -1 })
    totalPages.value = list.value.pagination.totalPages
  }

  const getVolume = async (volumeUuid) => volumeApi.show(volumeUuid)

  return {
    isLoading,
    data,
    page,
    loadVolumes,
    getVolume,
    initialLoadVolumes,
  }
}
