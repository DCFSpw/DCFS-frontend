import { ref } from "vue";
import diskApi from "src/api/diskApi";
import { isOauth } from "src/modules/Provider/providerType.js";
import { convertGbToByte } from "src/modules/Disk/helpers.js";
import useNotification from "src/modules/useNotification.js";

export default function () {
  const isLoading = ref(false);
  const data = ref({ credentials: {} });
  const form = ref(null);
  const { notify } = useNotification();

  const updateDisk = async (refresh) => {
    if (!(await form.value.validate())) {
      return;
    }

    isLoading.value = true;

    try {
      const toUpdate = isOauth(data.value.provider.type)
        ? {
            name: data.value.name,
            totalSpace: convertGbToByte(data.value.totalSpace),
          }
        : {
            name: data.value.name,
            totalSpace: convertGbToByte(data.value.totalSpace),
            credentials: data.value.credentials,
          };

      await diskApi.update(data.value.uuid, toUpdate);
      await refresh();
      notify({
        type: "positive",
        message: "Disk has been updated",
      });
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    data,
    form,
    updateDisk,
  };
}
