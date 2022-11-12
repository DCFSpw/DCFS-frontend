import {ref} from "vue";
import fileApi from "src/api/fileApi.js";

export default function() {
  const isLoading = ref(false)

  const saveAs = ({ name, buffers, mime = "application/octet-stream" }) => {
    const blob = new Blob([buffers], { type: mime });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = name || Math.random();
    a.href = blobUrl;
    a.click();
    URL.revokeObjectURL(blob);
  }

  const downloadSingle = async (file, block) => {
    const res = await fileApi.downloadBlock(block.uuid, file.uuid)
    console.log(res)
  }

  const download = async (file) => {
    isLoading.value = true

    const result = await fileApi.downloadFile(file.uuid)
    const returnedFile = result.file

    console.log(returnedFile)

    if (result.blocks.length === 1) {
      await downloadSingle(returnedFile, result.blocks[0])
    }

    console.log(result)
  }

  return {
    isLoading,
    download,
  }
}
