import {ref} from "vue";
import volumeApi from "src/api/volumeApi";
import Quasar from "quasar";

export default function() {
  const isLoading = ref(false)

  const deleteVolume = async ({ uuid }, callback) => {
    isLoading.value = true
    try {
      await volumeApi.delete(uuid)
      await callback()
      Quasar.Notify.create({ type: 'positive', message: 'Volume has been deleted' })
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    deleteVolume
  }
}
