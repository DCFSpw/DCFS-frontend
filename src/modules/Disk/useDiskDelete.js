import { ref } from "vue";
import diskApi from "src/api/diskApi";
import useNotification from "src/modules/useNotification.js";

export default function () {
  const isLoading = ref(false);
  const { notify } = useNotification();

  const deleteDisk = async ({ uuid }, callback) => {
    isLoading.value = true;
    try {
      await diskApi.delete(uuid);
      await callback();
      notify({
        type: "positive",
        message: "Disk has been deleted",
      });
    } finally {
      isLoading.value = false;
    }
  };

  const replaceDisk = async ({ uuid }, callback) => {
    isLoading.value = true;
    try {
      await diskApi.replace(uuid);
      await callback();
      notify({
        type: "positive",
        message: "Disk has been replaced",
      });
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    deleteDisk,
    replaceDisk,
  };
}
