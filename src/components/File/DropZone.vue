<template>
  <div class="main">
    <div
      class="dropzone-container"
      ref="dropZoneRef"
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

      <div class="absolute-full column flex-center q-inner-loading--dark" v-if="isDragging">
        <h3>Drop file to upload</h3>
      </div>

      <q-inner-loading :showing="isLoading"/>
    </div>
  </div>
</template>

<script setup>

import {ref} from "vue";
import useUploadFile from "src/modules/File/useUploadFile.js";
import {useDropZone} from "@vueuse/core";

const { isLoading, upload } = useUploadFile()

const files = ref([])
const fileRef = ref(null)
const dropZoneRef = ref(null)

const onChange = () => files.value = [...fileRef.value.files]

const onDrop = (files) => {
  upload(files[0])
}

const { isOverDropZone: isDragging } = useDropZone(dropZoneRef, onDrop)

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
