import useUserSession from "src/modules/useUserSession";
import { useRouter } from "vue-router";
import useNotification from "src/modules/useNotification.js";

export default function () {
  const userSession = useUserSession();
  const router = useRouter();
  const { notify } = useNotification();
  const logout = async () => {
    userSession.token = "";
    userSession.user = {};
    notify({ type: "positive", message: "Logged out!" });
    await router.push({ name: "login" });
  };

  return {
    logout,
  };
}
