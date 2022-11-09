<template>
  <div class="explorer-nav q-mx-sm flex justify-around items-center">
    <div class="utility-btn" :class="{ disabled: !root.uuid }" @click="goUp">
      <q-icon name="fa-solid fa-arrow-up"/>

      <q-tooltip>
        Go up a directory
      </q-tooltip>
    </div>
    <div class="utility-btn" :class="{ disabled: refreshing }" @click="refresh">
      <q-icon name="fa-solid fa-refresh" :class="{ spinning: refreshing }"/>

      <q-tooltip>
        Refresh
      </q-tooltip>
    </div>
  </div>
</template>

<script setup>

import useExplorer from "src/modules/File/useExplorer.js";
import {ref} from "vue";

const {root, goPath, path, getFiles} = useExplorer()

const refreshing = ref(false)

const refresh = async () => {
  if (refreshing.value) return

  refreshing.value = true
  await getFiles()
  setTimeout(() => refreshing.value = false, 500)
}

const goUp = () => {
  path.value.length
    ? goPath(path.value.at(-1))
    : goPath(null)
}

</script>

<style scoped lang="scss">
.utility-btn {
  padding: 10px;
  border-radius: 5px;
  transition: all .2s ease-in-out;
  cursor: pointer;

  &.disabled {
    cursor: initial;
    color: darken(white, 40%)
  }

  &:hover {
    background-color: darken(white, 10%);
  }
}

.body--dark .utility-btn {
  &.disabled {
    color: lighten($dark, 40%)
  }

  &:hover {
    background-color: lighten($dark, 10%);
  }
}

.spinning {
  animation-name: spin;
  animation-duration: 1000ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes spin {
  from {
    transform:rotate(0deg);
  }
  to {
    transform:rotate(360deg);
  }
}
</style>
