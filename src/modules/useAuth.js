import useUserSession from "src/modules/useUserSession";
import {useRouter} from "vue-router";
import {useQuasar} from "quasar";

export default function () {
  const userSession = useUserSession()
  const router = useRouter()
  const $q = useQuasar()

  const login = async (response) => {
    userSession.token = response.token
    userSession.user = response.data
    $q.notify({ type: 'positive', message: 'Successfully logged in!' })
    await router.push({ name: 'dashboard'})
  }

  const register = async () => {
    $q.notify({ type: 'positive', message: 'Successfully registered! Now you can login to your account.' })
    await router.push({ name: 'login'})
  }

  const logout = async () => {
    userSession.token = ''
    userSession.user = {}
    $q.notify({ type: 'positive', message: 'Logged out!' })
    await router.push({ name: 'login' })
  }

  return {
    login,
    register,
    logout
  }
}
