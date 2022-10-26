import {ref} from "vue";
import volumeApi from "src/api/volumeApi";
import {useQuasar} from "quasar";

export default function() {
  const $q = useQuasar()
  const isLoading = ref(false)
  const data = ref({settings: {}})
  const form = ref(null)

  const makeAction = async (refresh, action) => {
    if (!await form.value.validate()) {
      return
    }

    isLoading.value = true;

    try {
      await action(data.value)
      await refresh()
    } finally {
      isLoading.value = false
    }
  }

  const updateVolume = async (refresh) => {
    await makeAction(refresh, (data) => volumeApi.update(data.uuid, data))
    $q.notify({ type: 'positive', message: 'Volume has been updated' })
  }

  const createVolume = async (refresh) => {
    await makeAction(() => refresh({ toLastPage: true }), (data) => volumeApi.create(data))
    data.value = {settings: {}}
    $q.notify({ type: 'positive', message: 'Volume has been created' })
  }

  return {
    isLoading,
    data,
    form,
    updateVolume,
    createVolume
  }
}
