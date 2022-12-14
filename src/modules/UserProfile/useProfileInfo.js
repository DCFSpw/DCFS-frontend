import { computed, ref } from "vue";
import userApi from "src/api/userApi";
import useUserSession from "src/modules/useUserSession";
import useNotification from "src/modules/useNotification.js";

export default function () {
  const isLoading = ref(false);
  const data = ref({});
  const originalData = ref({});
  const form = ref(null);
  const userSession = useUserSession();
  const { notify } = useNotification();

  const dataChanged = computed(() => {
    const original = JSON.stringify(originalData.value);
    const newData = JSON.stringify(data.value);
    return original !== newData;
  });

  const updateProfile = async () => {
    if (!(await form.value.validate())) {
      return;
    }

    isLoading.value = true;

    try {
      await userApi.updateProfile(data.value);
      notify({ type: "positive", message: "Profile updated" });

      userSession.user.firstName = data.value.firstName;
      userSession.user.lastName = data.value.lastName;

      originalData.value = { ...data.value };
    } finally {
      isLoading.value = false;
    }
  };

  const getProfile = async () => {
    data.value = await userApi.showProfile();
    originalData.value = { ...data.value };
  };

  return {
    isLoading,
    data,
    originalData,
    form,
    updateProfile,
    getProfile,
    dataChanged,
  };
}
