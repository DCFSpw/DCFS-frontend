<template>
  <div class="q-px-lg">
    <q-select
      :options="data"
      filled
      v-model="volume"
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
import {onMounted, watch} from "vue";
import VolumeSelectItem from "components/Volume/VolumeSelectItem.vue";
import useExplorer from "src/modules/File/useExplorer.js";

const { isLoading, data, loadVolumes, getVolume, initialLoadVolumes } = useVolumeSelectList()
const { volume, initVolume, setQueryParams } = useExplorer()

onMounted(() => initVolume(initialLoadVolumes, getVolume, data))

watch(volume, () => setQueryParams())

</script>

<style scoped lang="scss">
.volume-select {
  height: 50px;
}
</style>
