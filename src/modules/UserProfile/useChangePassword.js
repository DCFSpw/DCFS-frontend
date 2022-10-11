import {useQuasar} from "quasar";
import {reactive, ref} from "vue";
import userApi from "src/api/userApi";

export default function () {
  const $q = useQuasar()
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
      $q.notify({ type: 'positive', message: 'Password changed' })
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
