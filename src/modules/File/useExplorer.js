import {ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import fileApi from "src/api/fileApi.js";
import useVolumeList from "src/modules/Volume/useVolumeList.js";

const volume = ref('')
const root = ref('')
const path = ref([])
const files = ref([])
const isLoading = ref(false)

export default function() {
  const route = useRoute()
  const router = useRouter()

  const { getVolume } = useVolumeList()

  const initVolume = async (initialLoadVolumes, getVolume, data) => {
    await initialLoadVolumes()

    if (!route.query.volumeUuid) {
      volume.value = data.value[0]
      await setQueryParams()
    } else {
      volume.value = await getVolume(route.query.volumeUuid)
      root.value = route.query.rootUuid ? await fileApi.show(route.query.rootUuid) : null
    }

    await getFiles()
  }

  const getFiles = async () => {
    isLoading.value = true;
    try {
      files.value = await fileApi.index({ volumeUUID: volume.value.uuid, rootUUID: root.value?.uuid })
    } finally {
      isLoading.value = false
    }
  }

  const setQueryParams = async (reloadFiles = true) => {
    let query = { volumeUuid: volume.value.uuid }
    if (root.value) query.rootUuid = root.value.uuid

    await router.push({
      name: 'dashboard',
      query
    })

    if (reloadFiles) {
      await getFiles()
    }
  }

  const moveFile = async (file, rootUuid) => {
    await fileApi.update(file.uuid, { name: file.name, rootUUID: rootUuid })
    await getFiles()
  }

  watch(route, async (newValue) => {
    if (newValue.query.volumeUuid !== volume.value.uuid || newValue.query.rootUuid !== root.value?.uuid) {
      console.log('changes')
      if (newValue.query.volumeUuid !== volume.value.uuid)
        volume.value = await getVolume(newValue.query.volumeUuid)

      if (newValue.query.rootUuid !== root.value?.uuid)
        root.value = route.query.rootUuid ? await fileApi.show(route.query.rootUuid) : null

      await getFiles()
    }
  })

  return {
    volume,
    root,
    files,
    initVolume,
    getFiles,
    setQueryParams,
    moveFile,
  }
}
