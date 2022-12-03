import { ref } from "vue";
import diskApi from "src/api/diskApi";
import { DISK_CREATION_UID_KEY } from "src/modules/Disk/Const/DiskConst";
import { isOauth } from "src/modules/Provider/providerType.js";
import { convertGbToByte } from "src/modules/Disk/helpers.js";

export default function () {
  const isLoading = ref(false);
  const form = ref(null);
  const data = ref({ credentials: {} });

  const createDisk = async (refresh) => {
    const valid = await form.value.validate();
    if (!valid) {
      return;
    }

    isLoading.value = true;

    const oauth = isOauth(data.value.provider.type);

    try {
      const response = await diskApi.create({
        name: data.value.name,
        providerUUID: data.value.provider.uuid,
        volumeUUID: data.value.volume.uuid,
        totalSpace: convertGbToByte(data.value.totalSpace),
        credentials: oauth ? {} : data.value.credentials,
      });

      if (oauth) {
        localStorage.setItem(DISK_CREATION_UID_KEY, response.disk.uuid);
        window.location.replace(response.link);
      } else {
        await refresh({ toLastPage: true });
        data.value = { credentials: {} };
      }
    } finally {
      isLoading.value = false;
    }
  };

  return {
    data,
    isLoading,
    createDisk,
    form,
  };
}
