import {ref} from "vue";
import fileApi from "src/api/fileApi.js";
import {useQuasar} from "quasar";
import useExplorer from "src/modules/File/useExplorer.js";

const BLOCK_UPLOAD_TRIES = 3;
const RETRY_UPLOAD_HTTP_CODE = 449;

const uploadingFiles = ref([])

export default function() {
  const isLoading = ref(false)
  const $q = useQuasar()

  const {volume, root, getFiles} = useExplorer()

  const createFormData = (file, block, key) => {
    const formData = new FormData;
    formData.set('block', block.data, `part.${key}`);
    formData.append('fileUUID', file.uuid);
    return formData;
  }

  const uploadBlock = async (file, block, key) => {
    let isSuccess = false;
    let tryNumber = 0;
    let error = null;
    let result = null;

    do {
      tryNumber++;

      try {
        result = await fileApi.uploadBlock(block.uuid, createFormData(file, block, key))
        isSuccess = true
      } catch (e) {
        error = e;
      }
    } while (!isSuccess && tryNumber <= BLOCK_UPLOAD_TRIES)

    if (isSuccess) return result
    else throw error
  }

  const addUploadingFile = (volumeUuid, rootUuid, file) => {
    file.isUploading = true
    let data = { ...uploadingFiles.value }

    if (!rootUuid) rootUuid = 0

    if (!data[volumeUuid]) data[volumeUuid] = {}
    if (!data[volumeUuid][rootUuid]) data[volumeUuid][rootUuid] = {}
    data[volumeUuid][rootUuid][file.uuid] = file

    uploadingFiles.value = data
  }

  const removeUploadingFile = (volumeUuid, rootUuid, file) => {
    let data = { ...uploadingFiles.value }

    if (!rootUuid) rootUuid = 0

    if (data[volumeUuid] && data[volumeUuid][rootUuid] && data[volumeUuid][rootUuid][file.uuid]) {
      delete data[volumeUuid][rootUuid][file.uuid]

      if (!Object.values(data[volumeUuid][rootUuid]).length)
        delete data[volumeUuid][rootUuid]

      if (!Object.values(data[volumeUuid]).length)
        delete data[volumeUuid]
    }

    uploadingFiles.value = data
  }

  const createBlocks = async (initBlocks, fileToUpload) => {
    const blocks = [];
    let i = 0;
    let totalSize = 0

    const resultBlocks = initBlocks.sort((a, b) => a.order > b.order ? 1 : -1)

    for (const block of resultBlocks) {
      blocks.push({
        uuid: block.UUID,
        data: fileToUpload.slice(
          totalSize, Math.min(totalSize + block.size, fileToUpload.size), fileToUpload.type
        )
      })

      totalSize += block.size
      i++;
    }

    return blocks;
  }

  const initUpload = async (fileToUpload, volumeUuid, rootUuid) => {
    return fileApi.initUpload({
      volumeUUID: volumeUuid,
      rootUUID: rootUuid,
      file: {
        name: fileToUpload.name,
        type: 2,
        size: fileToUpload.size
      }
    })
  }

  const uploadCompleted = async (fileUuid, throwException = true) => {
    return fileApi.completeUpload(fileUuid, throwException)
  }

  const uploadBlocks = async (file, blocks, blocksToUpload = null) => {
    const promises = blocks
      .filter((block) => {
        if (blocksToUpload === null) return true;
        return !!blocksToUpload.find(blockToUpload => blockToUpload.UUID === block.uuid);
      })
      .map((block, key) => uploadBlock(file, block, key))
    await Promise.all(promises)
  }

  const upload = async (fileToUpload) => {
    if (!volume.value)
      return;

    isLoading.value = true;
    let initResult = null;
    const rootUuid = root.value?.uuid;
    const volumeUuid = volume.value.uuid

    try {
      initResult = await initUpload(fileToUpload, volumeUuid, rootUuid);
      addUploadingFile(volumeUuid, rootUuid, initResult.file)

      const blocks = await createBlocks(initResult.blocks, fileToUpload);
      await uploadBlocks(initResult.file, blocks);

      const result = await uploadCompleted(initResult.file.uuid, false)

      // If some blocks were not uploaded successfully, retry to upload them
      if (result.status === RETRY_UPLOAD_HTTP_CODE) {
        await uploadBlocks(initResult.file, locks, result.data);
        await uploadCompleted(initResult.file.uuid)
      }

      $q.notify({ type: 'positive', message: 'File uploaded' })
    } finally {
      if (initResult?.file) removeUploadingFile(volumeUuid, rootUuid, initResult.file)
      await getFiles()
      isLoading.value = false
    }
  }

  return {
    volume,
    isLoading,
    upload,
    uploadingFiles
  }
}
