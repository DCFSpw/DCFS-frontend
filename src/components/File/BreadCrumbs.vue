<template>
  <div class="q-pa-md breadcrumbs-wrapper q-mx-lg">
    <q-breadcrumbs>
      <q-breadcrumbs-el icon="home" :label="volume.name" to="/" @click="goPath(null)"/>
      <q-breadcrumbs-el v-for="p in path" :key="p.uuid" to="/" :label="p.name" @click="goPath(p)"/>
      <q-breadcrumbs-el v-if="root" :label="root.name"/>
    </q-breadcrumbs>
  </div>
</template>

<script setup>
import useExplorer from "src/modules/File/useExplorer.js";
import {useRouter} from "vue-router";

const {volume, root, path, goPath } = useExplorer()
const router = useRouter()
</script>

<style scoped lang="scss">
.breadcrumbs-wrapper {
  border-radius: 5px;
  background-color: darken(white, 5);
}

.body--dark .breadcrumbs-wrapper {
  background-color: var(--q-dark);
}
</style>
