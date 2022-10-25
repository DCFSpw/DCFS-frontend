import {ref} from "vue";
import volumeApi from "src/api/volumeApi";

export default function() {
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
  }

  const createVolume = async (refresh) => {
    await makeAction(() => refresh({ toLastPage: true }), (data) => volumeApi.create(data))
  }

  return {
    isLoading,
    data,
    form,
    updateVolume,
    createVolume
  }
}
