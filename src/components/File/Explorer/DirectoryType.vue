<template>
  <div class="q-pa-lg">
    <q-icon name="fa-solid fa-folder"/>
    {{ file.name }}
  </div>
</template>

<script setup>
const props = defineProps({
  file: Object
})
</script>

<style scoped>

</style>
