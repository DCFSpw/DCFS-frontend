import {ref} from "vue";
import diskApi from "src/api/diskApi";

export default function() {
  const isLoading = ref(false)
  const data = ref({})
  const page = ref(1)

  const getDisks= async ({ toLastPage, deleting } = {}) => {
    if (toLastPage) {
      page.value = data.value.pagination.totalPages
    }

    if (deleting && data.value.pagination.recordsOnPage <= 1) {
      page.value--;
    }

    isLoading.value = true;

    try {
      data.value = await diskApi.index({ page: page.value })

      if (toLastPage && page.value !== data.value.pagination.totalPages) {
        await getDisks({ toLastPage })
      }
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    data,
    page,
    getDisks
  }
}
