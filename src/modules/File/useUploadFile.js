import {ref} from "vue";
import fileApi from "src/api/fileApi.js";

const BLOCK_UPLOAD_TRIES = 3;

export default function() {
  const isLoading = ref(false)
  const blocks = ref([])
  const file = ref(null)
  const fileUUID = ref('')
  const volumeUUID = ref('2a0a6bd7-5845-11ed-9cd6-00ffb2e7fe76')

  const createFormData = (block, key) => {
    const formData = new FormData;
    formData.set('block', block.data, `${file.value?.name}.part.${key}`);
    formData.append('blockUUID', block.uuid);
    return formData;
  }

  const uploadBlock = async (block, key) => {
    let isSuccess = false;
    let tryNumber = 0;
    let error = null;
    let result = null;

    if (key === 1) {
      return
    }

    do {
      tryNumber++;

      try {
        result = await fileApi.uploadBlock(fileUUID.value, createFormData(block, key))
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
    fileUUID.value = result.UUID;

    blocks.value = [];
    let i = 0;
    let totalSize = 0

    const resultBlocks = result.Blocks.sort((a, b) => a.Order > b.Order ? 1 : -1)

    for (const block of resultBlocks) {
      blocks.value = [
        ...blocks.value,
        {
          uuid: block.UUID,
          data: file.value.slice(
            totalSize, Math.min(totalSize + block.Size, file.value.size), file.value.type
          )
        }
      ]

      totalSize += block.Size
      i++;
    }
  }

  const initUpload = async () => {
    return fileApi.initUpload({
      volumeUUID: volumeUUID.value,
      rootUUID: null,
      file: {
        name: file.value.name,
        type: 1,
        size: file.value.size
      }
    })
  }

  const uploadCompleted = async () => {
    return fileApi.completeUpload(fileUUID.value)
  }

  const upload = async (fileToUpload) => {
    file.value = fileToUpload
    await createBlocks();

    isLoading.value = true;
    const start = Date.now();
    const promises = blocks.value.map((block, key) => uploadBlock(block, key))
    await Promise.all(promises)
    await uploadCompleted()
    isLoading.value = false
  }

  return {
    isLoading,
    upload
  }
}
