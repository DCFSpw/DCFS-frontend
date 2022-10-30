<template>
  <div class="flex flex-center items-center q-pa-sm">
    <img :src="provider.logo" class="q-mr-sm" style="width: 30px"/> {{ provider.name }}
  </div>
</template>

<script setup>
const props = defineProps({
  provider: Object
})
</script>

