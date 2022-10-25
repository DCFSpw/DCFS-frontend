<template>
  <span>
    <span class="text-positive" v-if="value"><q-icon name="fa-solid fa-circle-check"/></span>
    <span class="text-negative" v-else><q-icon name="fa-solid fa-circle-xmark"/></span>
  </span>
</template>

<script setup>
const props = defineProps({
  value: Boolean
})
</script>

<style scoped>

</style>
