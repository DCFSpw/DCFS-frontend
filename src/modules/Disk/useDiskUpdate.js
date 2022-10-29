import {ref} from "vue";
import {useQuasar} from "quasar";
import diskApi from "src/api/diskApi";

export default function() {
  const $q = useQuasar()
  const isLoading = ref(false)
  const data = ref({settings: {}})
  const form = ref(null)

  const updateDisk = async (refresh) => {
    if (!await form.value.validate()) {
      return
    }

    isLoading.value = true;

    try {
      await diskApi.update(data.value.uuid, data.value)
      await refresh()
      $q.notify({ type: 'positive', message: 'Disk has been updated' })
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    data,
    form,
    updateDisk
  }
}
