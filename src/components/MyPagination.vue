<template>
  <div>
    <div class="q-ma-sm">
      <slot/>
    </div>
    <div class="flex justify-center q-ma-lg">
      <q-pagination
        v-if="totalPages > 1"
        v-model="currentPage"
        :max="totalPages"
        :disable="isLoading"
      />
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from "vue";

const props = defineProps({
  callback: Function,
  isLoading: Boolean,
  pagination: Object,
  page: Number
})

const currentPage = ref(0)
const emit = defineEmits(['update:page'])

watch(currentPage, (newPage) => {
  emit('update:page', newPage)
  props.callback()
})

onMounted(() => currentPage.value = props.page)

const totalPages = computed(() => props.pagination?.totalPages ?? 1)

</script>
