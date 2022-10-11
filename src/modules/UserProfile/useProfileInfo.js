import {useQuasar} from "quasar";
import {reactive, ref} from "vue";
import userApi from "src/api/userApi";

export default function () {
  const $q = useQuasar()
  const isLoading = ref(false)
  const data = reactive({
    firstName: '',
    lastName: ''
  })
  const form = ref(null)

  const updateProfile = async () => {
    if (!await form.value.validate()) {
      return
    }


    isLoading.value = true

    try {
      await userApi.updateProfile(data)
      $q.notify({ type: 'positive', message: 'Profile updated' })
    } finally {
      isLoading.value = false
    }
  }

  const getProfile = async () => {
    data.value = await userApi.showProfile()
  }

  return {
    isLoading,
    data,
    form,
    updateProfile,
    getProfile,
  }
}
