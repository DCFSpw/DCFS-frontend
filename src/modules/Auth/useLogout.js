import useUserSession from "src/modules/useUserSession";
import {useRouter} from "vue-router";
import Quasar from "quasar";

export default function () {
  const userSession = useUserSession()
  const router = useRouter()

  const logout = async () => {
    userSession.token = ''
    userSession.user = {}
    Quasar.Notify.create({ type: 'positive', message: 'Logged out!' })
    await router.push({ name: 'login' })
  }

  return {
    logout
  }
}
