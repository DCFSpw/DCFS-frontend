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
      <div v-for="file in files" :key="file.uuid" class="col-xl-1 col-lg-2 col-md-3 col-sm-6 col-12">
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

const { isLoading, volume, files} = useExplorer()

const onClick = (event) => {
  console.log(event)
}

</script>

<style scoped>

</style>
