import {ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import fileApi from "src/api/fileApi.js";

const volume = ref('')
const root = ref('')
const path = ref([])
const files = ref([])
const isLoading = ref(false)
const selected = ref({})
const uploadFileRef = ref(null)
const search = ref('')

export default function() {
  const route = useRoute()
  const router = useRouter()

  const setRootFromApi = async () => {
    if (route.query.rootUuid) {
      const result = await fileApi.show(route.query.rootUuid)
      root.value = result.file
      path.value = result.path.reverse()
    } else {
      root.value = ''
      path.value = []
    }
  }

  const initVolume = async (initialLoadVolumes, getVolume, data) => {
    await initialLoadVolumes()

    if (!route.query.volumeUuid) {
      volume.value = data.value[0]
      await setQueryParams()
    } else {
      volume.value = await getVolume(route.query.volumeUuid)
      await setRootFromApi()
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

  const updateFile = async (file, data) => {
    isLoading.value = true
    try {
      await fileApi.update(file.uuid, { ...data, rootUUID: root.value?.uuid ?? null })
      await getFiles()
    } finally {
      isLoading.value = false
    }
  }

  const deleteFile = async (file) => {
    isLoading.value = true
    try {
      await fileApi.delete(file.uuid)
      await getFiles()
    } finally {
      isLoading.value = false
    }
  }

  const createDirectory = async (data) => {
    isLoading.value = true
    try {
      await fileApi.create({...data, volumeUUID: volume.value.uuid, rootUuid: root.value?.uuid ?? null})
      await getFiles()
    } finally {
      isLoading.value = false
    }
  }

  const goPath = async (newRoot) => {
    if (!newRoot) {
      root.value = ''
      path.value = []
    } else if (newRoot.uuid !== root.value.uuid) {
      if (root.value) {
        const existingKey = Object.keys(path.value).find(key => path.value[key].uuid === newRoot.uuid)

        if (!existingKey) {
          path.value = [...path.value, root.value]
        } else {
          path.value = path.value.slice(0, parseInt(existingKey))
        }
      }

      root.value = newRoot
    }

    selected.value = {}
    await setQueryParams()
  }

  return {
    volume,
    path,
    root,
    files,
    isLoading,
    initVolume,
    getFiles,
    setQueryParams,
    moveFile,
    selected,
    deleteFile,
    updateFile,
    createDirectory,
    goPath,
    setRootFromApi,
    uploadFileRef,
    search,
  }
}
