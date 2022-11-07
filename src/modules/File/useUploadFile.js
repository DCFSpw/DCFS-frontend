import {ref} from "vue";
import fileApi from "src/api/fileApi.js";
import {useQuasar} from "quasar";
import useExplorer from "src/modules/File/useExplorer.js";

const BLOCK_UPLOAD_TRIES = 3;
const RETRY_UPLOAD_HTTP_CODE = 449;

export default function() {
  const isLoading = ref(false)
  const blocks = ref([])
  const file = ref(null)
  const fileUUID = ref('')
  const $q = useQuasar()

  const {volume, root, getFiles} = useExplorer()

  const createFormData = (block, key) => {
    const formData = new FormData;
    formData.set('block', block.data, `${file.value?.name}.part.${key}`);
    formData.append('fileUUID', fileUUID.value);
    return formData;
  }

  const uploadBlock = async (block, key) => {
    let isSuccess = false;
    let tryNumber = 0;
    let error = null;
    let result = null;

    do {
      tryNumber++;

      try {
        result = await fileApi.uploadBlock(block.uuid, createFormData(block, key))
        isSuccess = true
      } catch (e) {
        error = e;
      }
    } while (!isSuccess && tryNumber <= BLOCK_UPLOAD_TRIES)

    if (isSuccess) return result
    else throw error
  }

  const createBlocks = async () => {
    const result = await initUpload();
    fileUUID.value = result.file.uuid;

    blocks.value = [];
    let i = 0;
    let totalSize = 0

    const resultBlocks = result.blocks.sort((a, b) => a.order > b.order ? 1 : -1)

    for (const block of resultBlocks) {
      blocks.value = [
        ...blocks.value,
        {
          uuid: block.UUID,
          data: file.value.slice(
            totalSize, Math.min(totalSize + block.size, file.value.size), file.value.type
          )
        }
      ]

      totalSize += block.size
      i++;
    }
  }

  const initUpload = async () => {
    return fileApi.initUpload({
      volumeUUID: volume.value.uuid,
      rootUUID: root.value?.uuid,
      file: {
        name: file.value.name,
        type: 2,
        size: file.value.size
      }
    })
  }

  const uploadCompleted = async (throwException = true) => {
    return fileApi.completeUpload(fileUUID.value, throwException)
  }

  const uploadBlocks = async (blocksToUpload = null) => {
    const promises = blocks.value
      .filter((block) => {
        if (blocksToUpload === null) return true;
        return !!blocksToUpload.find(blockToUpload => blockToUpload.UUID === block.uuid);
      })
      .map((block, key) => uploadBlock(block, key))
    await Promise.all(promises)
  }

  const upload = async (fileToUpload) => {
    if (!volume.value)
      return;

    isLoading.value = true;

    try {
      file.value = fileToUpload
      await createBlocks();
      await uploadBlocks();

      const result = await uploadCompleted(false)

      // If some blocks were not uploaded successfully, retry to upload them
      if (result.status === RETRY_UPLOAD_HTTP_CODE) {
        await uploadBlocks(result.data);
        await uploadCompleted()
      }

      $q.notify({ type: 'positive', message: 'File uploaded' })
    } finally {
      await getFiles()
      isLoading.value = false
    }
  }

  return {
    volume,
    isLoading,
    upload
  }
}
