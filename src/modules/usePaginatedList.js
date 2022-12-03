import {computed, ref} from "vue";

export default function() {
  const isLoading = ref(false)
  const data = ref({})
  const page = ref(1)
  const isEmpty = computed(() => data.value.pagination?.totalRecords === 0 || !data.value.pagination)

  const getData = async (callback, { toLastPage, deleting } = {}) => {
    if (toLastPage && data.value.pagination) {
      page.value = Math.max(data.value.pagination.totalPages, 1)
    }

    if (deleting && data.value.pagination.recordsOnPage <= 1) {
      page.value = Math.max(page.value - 1, 1)
    }

    isLoading.value = true

    try {
      data.value = await callback({ page: page.value })

      if (toLastPage && page.value !== data.value.pagination.totalPages) {
        await getData(callback, { toLastPage })
      }
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    data,
    page,
    getData,
    isEmpty
  }
}
