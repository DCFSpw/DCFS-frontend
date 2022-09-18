import {computed, reactive} from "vue";
import {useStorage} from "@vueuse/core";

const storageToken = useStorage('token', '')
const user = useStorage('user', {})

const userSession = reactive({
  token: storageToken,
  user,
  isLoggedIn: computed(() => storageToken.value !== '')
})

export default function () {
  return userSession
}
