<template>
  <div class="main">
    <div
      class="dropzone-container"
      @dragover="dragOver"
      @dragleave="dragLeave"
      @drop="drop"
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

      <div v-if="isDragging">
        Drop to upload
      </div>

      <slot/>

      <q-inner-loading :showing="isLoading"/>
    </div>
  </div>
</template>

<script setup>

import {ref} from "vue";
import useUploadFile from "src/modules/File/useUploadFile.js";

const { isLoading, upload } = useUploadFile()

const isDragging = ref(false)
const files = ref([])
const fileRef = ref(null)

const onChange = () => files.value = [...fileRef.value.files]
const dragOver = (e) => {
  e.preventDefault()
  isDragging.value = true
}
const dragLeave = () => isDragging.value = false
const drop = (e) => {
  e.preventDefault()
  fileRef.value.files = e.dataTransfer.files
  onChange()
  isDragging.value = false
  upload(fileRef.value.files.item(0))
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
