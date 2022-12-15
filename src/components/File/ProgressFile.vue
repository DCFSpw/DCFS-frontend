<template>
  <q-item-section class="flex items-center" style="flex-direction: row; justify-content: flex-start !important;">
    <q-circular-progress
      show-value
      font-size="10px"
      size="35px"
      :thickness="0.1"
      color="primary"
      class="q-mr-md"
      :value="progressPercent"
    >
      <q-icon :name="icon" />
      {{ progressPercent }}%
    </q-circular-progress>
    {{ file.name }}
  </q-item-section>
</template>

<script setup>
import {computed} from "vue";
import useUploadFile from "src/modules/File/useUploadFile.js";
import useDownloadFile from "src/modules/File/useDownloadFile.js";

const props = defineProps({
  file: Object,
  downloading: Boolean
})

const { uploadingFilesProgress } = useUploadFile()
const { downloadingFileProgress } = useDownloadFile()

const icon = computed(() => {
  if (props.downloading) return 'fa-solid fa-arrow-down'
  return 'fa-solid fa-arrow-up'
})

const progressPercent = computed(() => {
  const progress = props.downloading ? downloadingFileProgress.value : uploadingFilesProgress.value[props.file.uuid]

  return progress?.current ? Math.round((progress.current / progress.total) * 100) : 0
})
</script>

<style scoped>

</style>
