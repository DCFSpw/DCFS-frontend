<template>
  <q-card class="fixed-bottom-right upload-progress" v-if="flatUploadingFiles.length || downloadingFile">
    <div class="flex justify-between hide-btn" style="width: 300px" @click="hidden = !hidden">
      <div class="q-pa-md flex column">
        <div v-if="flatUploadingFiles.length">
          <q-spinner class="q-mr-sm"/> Uploading: {{ flatUploadingFiles.length }} file(s)
        </div>
        <div v-if="downloadingFile">
          <q-spinner class="q-mr-sm"/> Downloading: 1 file
        </div>
      </div>
      <div class="q-pa-md">
        <q-icon :name="`fa-solid ${hidden ? 'fa-caret-up' : 'fa-caret-down'}`"/>
      </div>
    </div>

    <div class="upload-block" :class="{ zeroHeight: hidden }" style="width: 300px">
      <q-list bordered separator class="q-pa-md" style="max-height: 300px; overflow: auto;">
        <q-item v-if="downloadingFile">
          <q-item-section class="flex items-center" style="flex-direction: row; justify-content: flex-start !important;">
            <q-circular-progress
              indeterminate
              show-value
              font-size="10px"
              size="30px"
              :thickness="0.1"
              color="primary"
              class="q-mr-md"
            >
              <q-icon name="fa-solid fa-arrow-down" class="q-mr-xs" />
            </q-circular-progress>
            {{ downloadingFile.name }}
          </q-item-section>
        </q-item>

        <q-item v-for="file in flatUploadingFiles" :key="file.uuid">
          <q-item-section class="flex items-center" style="flex-direction: row; justify-content: flex-start !important;">
            <q-circular-progress
              indeterminate
              show-value
              font-size="10px"
              size="30px"
              :thickness="0.1"
              color="primary"
              class="q-mr-md"
            >
              <q-icon name="fa-solid fa-arrow-up" class="q-mr-xs" />
            </q-circular-progress>
            {{ file.name }}
          </q-item-section>
        </q-item>
      </q-list>
    </div>

  </q-card>
</template>

<script setup>

import useUploadFile from "src/modules/File/useUploadFile.js";
import {computed, ref, watch} from "vue";
import useDownloadFile from "src/modules/File/useDownloadFile.js";

const { downloadingFile } = useDownloadFile()
const { uploadingFiles } = useUploadFile()

const hidden = ref(false)

const flattenObj = (ob) => {
  let result = {};

  for (const i in ob) {
    if ((typeof ob[i]) === 'object' && !Array.isArray(ob[i]) && !ob[i].uuid) {
      const temp = flattenObj(ob[i]);
      for (const j in temp)
        result[i + '.' + j] = temp[j];
    } else
      result[i] = ob[i];
  }
  return result;
};

const flatUploadingFiles = computed(() => Object.values(flattenObj(uploadingFiles.value)))

watch(flatUploadingFiles, (newValue) => {
  if (newValue.length) hidden.value = false
})

</script>

<style scoped lang="scss">
.upload-progress {
  .hide-btn {
    cursor: pointer;
    transition: all .2s ease-in-out;

    &:hover {
      background-color: darken(white, 5);
    }
  }

  .upload-block {
    transition: all .2s linear;
    max-height: 300px;
  }

  .upload-block.zeroHeight {
    max-height: 0;
  }

  .spinner-icon {
    width: 20px;
    height: 20px;
  }
}

.body--dark .upload-progress {
  .hide-btn {
    cursor: pointer;

    &:hover {
      background-color: lighten($dark, 5);
    }
  }
}
</style>
