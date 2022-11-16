import useUserSession from "src/modules/useUserSession";
import {useRouter} from "vue-router";
import Quasar from "quasar";
import {reactive, ref} from "vue";
import authApi from "src/api/authApi";

export default function () {
  const userSession = useUserSession()
  const router = useRouter()

  const data = reactive({
    email: '',
    password: ''
  })
  const form = ref(null)
  const isLoading = ref(false)

  const login = async () => {
    isLoading.value = true

    try {
      const response = await authApi.login(data)
      console.log(response)
      userSession.token = response.token
      userSession.user = response
      Quasar.Notify.create({ type: 'positive', message: 'Successfully logged in!' })
      await router.push({ name: 'dashboard'})
    } finally {
      isLoading.value = false
    }
  }

  return {
    login,
    form,
    isLoading,
    data
  }
}
