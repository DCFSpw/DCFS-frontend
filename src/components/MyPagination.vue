<template>
  <div>
    <div v-if="emptyResult" class="flex flex-center column q-pa-lg">
      <slot name="empty"/>
    </div>
    <div v-else class="q-ma-sm">
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

watch(() => props.page, (newPage) => {
  currentPage.value = newPage
})

onMounted(() => currentPage.value = props.page)

const totalPages = computed(() => props.pagination?.totalPages ?? 1)
const emptyResult = computed(() => props.pagination?.totalRecords === 0)

</script>
