<template>
  <div class="q-pa-md breadcrumbs-wrapper q-mx-lg">
    <q-breadcrumbs>
      <q-breadcrumbs-el icon="home" :label="volume.name" to="/" @click="goPath(null)"/>
      <q-breadcrumbs-el v-if="root" :label="root.name"/>
    </q-breadcrumbs>
  </div>
</template>

<script setup>
import useExplorer from "src/modules/File/useExplorer.js";
import {useRouter} from "vue-router";

const {volume, root, path, setQueryParams} = useExplorer()
const router = useRouter()

const goPath = (newRoot) => {
  root.value = newRoot
  setQueryParams()
}
</script>

<style scoped lang="scss">
.breadcrumbs-wrapper {
  background-color: var(--q-dark);
  border-radius: 5px;
}
</style>