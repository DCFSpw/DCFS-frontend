import {useQuasar} from 'quasar';
import diskApi from 'src/api/diskApi';
import {useRoute, useRouter} from "vue-router";
import {DISK_CREATION_UID_KEY} from "src/modules/Disk/Const/DiskConst";

export default function () {
  const $q = useQuasar()
  const route = useRoute()
  const router = useRouter()

  const checkOauth = async () => {
    const code = route.query.code ?? null
    if (code === null) {
      $q.notify({ type: 'negative', message: 'Oauth code not found.' })
      await router.push({ name: 'disks' });
      return
    }

    const diskUuid = localStorage.getItem(DISK_CREATION_UID_KEY)
    if (diskUuid === null) {
      $q.notify({ type: 'negative', message: 'Disk uuid not found in local storage.' })
      await router.push({ name: 'disks' });
      return
    }

    localStorage.removeItem(DISK_CREATION_UID_KEY)

    try {
      const response = await diskApi.oauth(diskUuid, {
        providerUUID: 'dcc7708a-993d-4775-902f-dd266a5f2138',
        volumeUUID: '654d47a6-dba0-4bc7-9cee-9099d456fe8a',
        diskUuid: diskUuid,
        code
      })

      if (response.success) {
        $q.notify({ type: 'positive', message: 'Disk added successfully.' })
      } else {
        $q.notify({ type: 'negative', message: 'Something went wrong. Please try again later.' })
      }

    } finally {
      await router.push({ name: 'disks' });
    }
  }

  return {
    checkOauth
  }
}
