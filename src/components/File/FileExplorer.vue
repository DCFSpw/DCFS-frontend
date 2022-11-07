<template>
  <div>
    <div class="row full-width">
      <div class="column col-xl-4 col-12">
        <volume-select/>
      </div>
      <div class="column col-xl-8 col-12">
        <bread-crumbs/>
      </div>
    </div>
    <div class="flex full-width full-height q-mt-lg">
      <div v-for="file in files" :key="file.uuid">
        <file-type :file="file" />

<!--        <directory-type v-if="file.type === 1" :file="file" />
        <file-type v-else :file="file" />-->
      </div>
    </div>
  </div>
</template>

<script setup>

import VolumeSelect from "components/File/VolumeSelect.vue";
import BreadCrumbs from "components/File/BreadCrumbs.vue";
import useExplorer from "src/modules/File/useExplorer.js";
import FileType from "components/File/Explorer/FileType.vue";

const { isLoading, volume, files} = useExplorer()

</script>

<style scoped>

</style>
