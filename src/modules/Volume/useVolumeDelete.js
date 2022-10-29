import {ref} from "vue";
import volumeApi from "src/api/volumeApi";
import {useQuasar} from "quasar";

export default function() {
  const $q = useQuasar()
  const isLoading = ref(false)

  const deleteVolume = async ({ uuid }, callback) => {
    isLoading.value = true
    try {
      await volumeApi.delete(uuid)
      await callback()
      $q.notify({ type: 'positive', message: 'Volume has been deleted' })
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    deleteVolume
  }
}
