import {ref} from "vue";
import userApi from "src/api/userApi";
import Quasar from "quasar";

export default function () {
  const isLoading = ref(false)
  const data = ref({})
  const form = ref(null)

  const changePassword = async () => {
    if (!await form.value.validate()) {
      return
    }

    isLoading.value = true

    try {
      await userApi.changePassword(data.value)
      data.value = {}
      form.value.resetValidation()
      Quasar.Notify.create({ type: 'positive', message: 'Password changed' })
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    data,
    form,
    changePassword
  }
}
