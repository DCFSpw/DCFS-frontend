<template>
  <div class="flex flex-center items-center q-pa-sm">
    <q-icon name="fa-solid fa-save" size="30px" class="q-mr-sm"/> {{ name }}
  </div>
</template>

<script setup>
import {computed} from "vue";

const props = defineProps({
  volume: Object
})

const name = computed(() => props.volume.name === '' ? 'Unnamed volume' : props.volume.name)
</script>

