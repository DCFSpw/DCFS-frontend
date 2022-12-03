import diskApi from "src/api/diskApi";
import { useRoute, useRouter } from "vue-router";
import { DISK_CREATION_UID_KEY } from "src/modules/Disk/Const/DiskConst";
import useNotification from "src/modules/useNotification.js";

export default function () {
  const route = useRoute();
  const router = useRouter();
  const { notify } = useNotification();

  const checkOauth = async () => {
    const code = route.query.code ?? null;
    if (code === null) {
      notify({
        type: "negative",
        message: "Oauth code not found.",
      });
      await router.push({ name: "disks" });
      return;
    }

    const diskUuid = localStorage.getItem(DISK_CREATION_UID_KEY);
    if (diskUuid === null) {
      notify({
        type: "negative",
        message: "Disk uuid not found in local storage.",
      });
      await router.push({ name: "disks" });
      return;
    }

    localStorage.removeItem(DISK_CREATION_UID_KEY);

    try {
      await diskApi.oauth(diskUuid, {
        diskUuid: diskUuid,
        code,
      });

      notify({
        type: "positive",
        message: "Disk added successfully",
      });
    } finally {
      await router.push({ name: "disks" });
    }
  };

  return {
    checkOauth,
  };
}
