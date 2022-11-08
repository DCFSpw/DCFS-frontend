<template>
  <q-page class="q-pa-lg">
    <div class="row full-width">
      <div class="column col-xl-4 col-12">
        <volume-select/>
      </div>
      <div class="column col-xl-8 col-12">
        <bread-crumbs/>
      </div>
    </div>
    <transition-group
      class="flex full-width full-height q-mt-lg row items-stretch"
      enter-active-class="animated fadeIn"
      tag="div"
    >
      <div v-for="file in sortedFiles" :key="file.uuid" class="col-xl-1 col-lg-2 col-md-3 col-sm-6 col-12">
        <file-type :file="file" />
      </div>
    </transition-group>

    <context-menu/>
  </q-page>
</template>

<script setup>

import VolumeSelect from "components/File/VolumeSelect.vue";
import BreadCrumbs from "components/File/BreadCrumbs.vue";
import useExplorer from "src/modules/File/useExplorer.js";
import FileType from "components/File/FileType.vue";
import ContextMenu from "components/File/ContextMenu.vue";
import {computed, watch} from "vue";
import {useRoute} from "vue-router";
import useVolumeSelectList from "src/modules/Volume/useVolumeSelectList.js";

const { isLoading, volume, files, getFiles, setRootFromApi, root } = useExplorer()
const { getVolume } = useVolumeSelectList()

const route = useRoute()

const sortedFiles = computed(() => [...files.value].sort((a, b) => a.type > b.type ? 1 : -1))

watch(route, async (route) => {
  if (route.name !== 'dashboard') return

  const newVolumeUuid = route.query.volumeUuid
  const newRootUuid = route.query.rootUuid
  if (newVolumeUuid !== volume.value.uuid || newRootUuid !== root.value?.uuid) {
    if (newVolumeUuid !== volume.value.uuid)
      volume.value = await getVolume(newVolumeUuid)

    if (newRootUuid !== root.value?.uuid)
      await setRootFromApi()

    await getFiles()
  }
})
</script>

<style scoped>

</style>
