import { useRouter } from "vue-router";
import { reactive, ref } from "vue";
import authApi from "src/api/authApi";
import useNotification from "src/modules/useNotification.js";

export default function () {
  const router = useRouter();
  const data = reactive({
    email: "",
    password: "",
    passwordRepeat: "",
    firstName: "",
    lastName: "",
  });
  const form = ref(null);
  const isLoading = ref(false);
  const { notify } = useNotification();

  const register = async () => {
    isLoading.value = true;

    try {
      const { passwordRepeated, ...apiData } = data;
      await authApi.register(apiData);
      notify({
        type: "positive",
        message: "Successfully registered! Now you can login to your account.",
      });
      await router.push({ name: "login" });
    } finally {
      isLoading.value = false;
    }
  };

  return {
    register,
    form,
    isLoading,
    data,
  };
}
