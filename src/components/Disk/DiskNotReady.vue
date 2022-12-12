<template>
  <div style="position: absolute; top: 50%; right: 15px; transform: translateY(-50%);" v-if="!disk.isReady">
    <q-icon name="fa-solid fa-circle-exclamation" color="negative" size="20px" />
    <q-tooltip>
      The disk is not ready for use. One of the reasons may be that provided credentials are invalid, or the cloud server is unavailable.
    </q-tooltip>
  </div>
</template>

<script setup>
const props = defineProps({
  disk: Object
})
</script>
