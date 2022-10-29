<template>
  <div class="flex flex-center items-center q-pa-sm">
    <q-img :src="provider.logo" width="30px" class="q-mr-sm"/> {{ provider.name }}
  </div>
</template>

<script setup>
const props = defineProps({
  provider: Object
})
</script>

