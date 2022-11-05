import {ref} from "vue";
import {useQuasar} from "quasar";
import diskApi from "src/api/diskApi";
import {isOauth} from "src/modules/Provider/providerType.js";

export default function() {
  const $q = useQuasar()
  const isLoading = ref(false)
  const data = ref({credentials: {}})
  const form = ref(null)

  const updateDisk = async (refresh) => {
    if (!await form.value.validate()) {
      return
    }

    isLoading.value = true;

    try {
      const toUpdate = isOauth(data.value.provider.type)
        ? { name: data.value.name }
        : { name: data.value.name, credentials: data.value.credentials }

      await diskApi.update(data.value.uuid, toUpdate)
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
