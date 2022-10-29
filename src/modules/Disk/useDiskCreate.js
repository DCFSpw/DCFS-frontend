import {reactive, ref} from 'vue';
import diskApi from 'src/api/diskApi';
import {DISK_CREATION_UID_KEY} from "src/modules/Disk/Const/DiskConst";

export default function () {
  const isLoading = ref(false)
  const form = ref(null)
  const data = reactive({
    name: ''
  })

  const createDisk = async (refresh) => {
    const valid = await form.value.validate();
    if (!valid) {
      return;
    }

    isLoading.value = true

    try {
      const response = await diskApi.create({
        name: data.name,
        providerUUID: data.provider.uuid,
        volumeUUID: 'ed7e168f-f23a-45e5-83bb-2e5df04acd85',
        credentials: {}
      })

      localStorage.setItem(DISK_CREATION_UID_KEY, response.disk.uuid)
      window.location.replace(response.link)
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
