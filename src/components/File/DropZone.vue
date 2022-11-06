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

      <div style="width: 20%">
        <q-select
          :options="selectData"
          filled
          v-model="volume"
          label="Select Volume"
          lazy-rules
          :loading="selectLoading"
          @virtual-scroll="loadVolumes"
        >
          <template #selected>
            <volume-select-item v-if="volume" :volume="volume" />
          </template>

          <template #option="scope">
            <q-item v-bind="scope.itemProps">
              <volume-select-item :volume="scope.opt" />
            </q-item>
          </template>
        </q-select>
      </div>

      <slot/>

      <div class="absolute-full column flex-center q-inner-loading--dark" v-if="isDragging">
        <h3>Drop file to upload</h3>
      </div>

      <q-inner-loading :showing="isLoading" label="Uploading..."/>
    </div>
  </div>
</template>

<script setup>

import {onMounted, ref} from "vue";
import useUploadFile from "src/modules/File/useUploadFile.js";
import {useDropZone} from "@vueuse/core";
import useVolumeSelectList from "src/modules/Volume/useVolumeSelectList.js";
import VolumeSelectItem from "components/Volume/VolumeSelectItem.vue";

const { isLoading, upload, volume } = useUploadFile()
const { isLoading: selectLoading, data: selectData, loadVolumes, initialLoadVolumes } = useVolumeSelectList()

const files = ref([])
const fileRef = ref(null)
const dropZoneRef = ref(null)

onMounted(() => initialLoadVolumes());

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
