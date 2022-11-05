import useUserSession from "src/modules/useUserSession";
import {useRouter} from "vue-router";
import {useQuasar} from "quasar";

export default function () {
  const userSession = useUserSession()
  const router = useRouter()
  const $q = useQuasar()

  const logout = async () => {
    userSession.token = ''
    userSession.user = {}
    $q.notify({ type: 'positive', message: 'Logged out!' })
    await router.push({ name: 'login' })
  }

  return {
    logout
  }
}
