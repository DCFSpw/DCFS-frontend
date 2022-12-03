import { ref } from "vue";
import volumeApi from "src/api/volumeApi";
import useNotification from "src/modules/useNotification.js";

export default function () {
  const isLoading = ref(false);
  const { notify } = useNotification();

  const deleteVolume = async ({ uuid }, callback) => {
    isLoading.value = true;
    try {
      await volumeApi.delete(uuid);
      await callback();
      notify({ type: "positive", message: "Volume has been deleted" });
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    deleteVolume,
  };
}
