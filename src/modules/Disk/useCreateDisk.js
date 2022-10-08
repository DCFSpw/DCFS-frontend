import {reactive, ref} from 'vue';
import diskApi from 'src/api/diskApi';
import {DISK_CREATION_UID_KEY} from "src/modules/Disk/Const/DiskConst";

export default function () {
  const isLoading = ref(false)
  const form = ref(null)
  const data = reactive({
    name: ''
  })

  const createDisk = async () => {
    const valid = await form.value.validate();
    if (!valid) {
      return;
    }

    isLoading.value = true

    try {
      const response = await diskApi.create({
        ...data,
        providerUUID: 'dcc7708a-993d-4775-902f-dd266a5f2138',
        volumeUUID: '654d47a6-dba0-4bc7-9cee-9099d456fe8a',
        credentials: ''
      })

      localStorage.setItem(DISK_CREATION_UID_KEY, response.response.uuid)
      window.location.replace(response.response.link)
    } finally {
      isLoading.value = false
    }
  }

  return {
    data,
    isLoading,
    createDisk,
    form,
  }
}
