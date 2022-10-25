import {ref} from "vue";
import volumeApi from "src/api/volumeApi";

export default function() {
  const isLoading = ref(false)

  const deleteVolume = async ({ uuid }, callback) => {
    isLoading.value = true
    try {
      await volumeApi.delete(uuid)
      await callback()
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    deleteVolume
  }
}
