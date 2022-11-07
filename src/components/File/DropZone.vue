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
        ref="fileRef"
        accept=".pdf,.jpg,.jpeg,.png"
      />

      <slot/>

      <div class="absolute-full column flex-center q-inner-loading--dark" v-if="isOverDropZone">
        <h3>Drop file to upload</h3>
      </div>

      <q-inner-loading :showing="isLoading" label="Uploading..."/>
    </div>
  </div>
</template>

<script setup>

import {ref} from "vue";
import useUploadFile from "src/modules/File/useUploadFile.js";

const { isLoading, upload, volume } = useUploadFile()

const files = ref([])
const fileRef = ref(null)

const onChange = () => files.value = [...fileRef.value.files]

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
  if (files.length) upload(files[0])
}

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
