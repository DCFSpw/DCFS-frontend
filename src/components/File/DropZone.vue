<template>
  <div class="main">
    <div
      class="dropzone-container relative-position"
      @dragenter="onDragEnter"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <input
        type="file"
        multiple
        name="file"
        id="fileInput"
        class="hidden-input"
        @change="onChange"
        ref="uploadFileRef"
        accept=".pdf,.jpg,.jpeg,.png"
      />

      <slot/>

      <div class="absolute-full column flex-center q-inner-loading--dark" v-if="isOverDropZone">
        <h3>Drop file to upload</h3>
      </div>
    </div>
  </div>
</template>

<script setup>

import {onBeforeMount, onMounted, ref} from "vue";
import useUploadFile from "src/modules/File/useUploadFile.js";
import useExplorer from "src/modules/File/useExplorer.js";

const { isLoading, upload, volume, uploadingFiles } = useUploadFile()
const { uploadFileRef } = useExplorer()

const onChange = () => {
  if (uploadFileRef.value.files.length)
    Array.from(uploadFileRef.value.files).forEach((file) => upload(file))
}

const counter = ref(0)
const isOverDropZone = ref(false)

const isFile = (e) => e.dataTransfer.items.length > 0 && e.dataTransfer.items[0]?.kind === 'file'

const onDragEnter = (e) => {
  if (!isFile(e)) return
  e.preventDefault()
  counter.value++
  isOverDropZone.value = true
}

const onDragOver = (e) => {
  e.preventDefault()
}

const onDragLeave = (e) => {
  if (!isFile(e)) return
  e.preventDefault()
  counter.value--
  if (counter.value === 0) isOverDropZone.value = false
}

const onDrop = (e) => {
  if (!isFile(e)) return
  e.preventDefault()
  counter.value = 0
  isOverDropZone.value = false
  const files = Array.from(e.dataTransfer?.files ?? [])
  if (files.length) {
    files.forEach((file) => upload(file))
  }
}

const onWindowLeave = (e) => {
  if (
    Object.values(uploadingFiles.value).length
    && !window.confirm('Do you really want to leave? you have unsaved changes!')
  ) {
    e.preventDefault()
    e.returnValue = ''
  }
}

onMounted(() => window.addEventListener('beforeunload', onWindowLeave))
onBeforeMount(() => window.removeEventListener('beforeunload', onWindowLeave))

</script>

<style scoped lang="scss">
.hidden-input {
  opacity: 0;
  overflow: hidden;
  position: absolute;
  width: 1px;
  height: 1px;
}
</style>
