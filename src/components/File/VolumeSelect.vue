<template>
  <div class="q-px-sm">
    <q-select
      :options="data"
      filled
      v-model="volumeProxy"
      lazy-rules
      :loading="isLoading"
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
</template>

<script setup>
import useVolumeSelectList from "src/modules/Volume/useVolumeSelectList.js";
import {onMounted, ref, watch} from "vue";
import VolumeSelectItem from "components/Volume/VolumeSelectItem.vue";
import useExplorer from "src/modules/File/useExplorer.js";

const { isLoading, data, loadVolumes, getVolume, initialLoadVolumes } = useVolumeSelectList()
const { volume, root, path, initVolume, setQueryParams } = useExplorer()

const volumeProxy = ref(null)

onMounted(() => initVolume(initialLoadVolumes, getVolume, data))

watch(volume, () => volumeProxy.value = { ...volume.value })
watch(volumeProxy, () => {
  if (volumeProxy.value.uuid !== volume.value.uuid) {
    volume.value = { ...volumeProxy.value }
    root.value = ''
    path.value = []
    setQueryParams()
  }
})

</script>

<style scoped lang="scss">
.volume-select {
  height: 50px;
}
</style>
