import { ref } from "vue";
import fileApi from "src/api/fileApi.js";
import useNotification from "src/modules/useNotification.js";

export const BLOCK_DOWNLOAD_TRIES = 3;

const downloadingFile = ref();

export default function () {
  const isLoading = ref(false);
  const { notify } = useNotification();

  const saveAs = ({ name, buffers, mime = "application/octet-stream" }) => {
    const blob = new Blob([buffers], { type: mime });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = name || Math.random();
    a.href = blobUrl;
    a.click();
    URL.revokeObjectURL(blob);
  };

  const getBlock = async (file, block) => {
    let isSuccess = false;
    let tryNumber = 0;
    let error = null;
    let result = null;

    do {
      tryNumber++;

      try {
        result = await fileApi.downloadBlock(block.uuid, file.uuid);
        isSuccess = true;
      } catch (e) {
        error = e;
      }
    } while (!isSuccess && tryNumber <= BLOCK_DOWNLOAD_TRIES);

    if (isSuccess) return result;
    else throw error;
  };

  const concatenate = (arrays) => {
    if (!arrays.length) return null;
    let totalLength = arrays.reduce((acc, value) => acc + value.length, 0);
    let result = new Uint8Array(totalLength);
    let length = 0;
    for (let array of arrays) {
      result.set(array, length);
      length += array.length;
    }
    return result;
  };

  const downloadSingle = async (file, block) => {
    const buffers = await getBlock(file, block);
    saveAs({ name: file.name, buffers });
  };

  const downloadMultiple = async (file, blocks) => {
    return await Promise.all(
      blocks.map(
        (block) =>
          new Promise(async (resolve) => {
            const buffer = await getBlock(file, block);
            resolve({
              order: block.order,
              buffer,
            });
          })
      )
    );
  };

  const saveMultiple = (file, blockBuffers) => {
    const sortedBuffers = blockBuffers
      .sort((a, b) => (a.order > b.order ? 1 : -1))
      .map((item) => new Uint8Array(item.buffer));

    const buffers = concatenate(sortedBuffers);
    saveAs({ name: file.name, buffers });
  };

  const download = async (file) => {
    if (downloadingFile.value) {
      notify({
        type: "negative",
        message: "Only single file can be downloaded at the time",
      });
      return;
    }

    isLoading.value = true;
    downloadingFile.value = file;

    try {
      const result = await fileApi.downloadFile(file.uuid);
      const returnedFile = result.file;

      if (result.blocks.length === 1) {
        await downloadSingle(returnedFile, result.blocks[0]);
      } else {
        const blockBuffers = await downloadMultiple(
          returnedFile,
          result.blocks
        );
        await saveMultiple(file, blockBuffers);
      }
    } finally {
      isLoading.value = false;
      downloadingFile.value = null;
    }
  };

  return {
    isLoading,
    downloadingFile,
    download,
  };
}
