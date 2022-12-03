import { ref } from "vue";
import Quasar from "quasar";
import diskApi from "src/api/diskApi";

export default function () {
  const isLoading = ref(false);

  const deleteDisk = async ({ uuid }, callback) => {
    isLoading.value = true;
    try {
      await diskApi.delete(uuid);
      await callback();
      Quasar.Notify.create({
        type: "positive",
        message: "Disk has been deleted",
      });
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    deleteDisk,
  };
}
