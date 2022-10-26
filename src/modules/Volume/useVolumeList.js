import {ref} from "vue";
import volumeApi from "src/api/volumeApi";

export default function() {
  const isLoading = ref(false)
  const data = ref({})
  const page = ref(1)

  const getVolumes = async ({ toLastPage, deleting } = {}) => {
    if (toLastPage) {
      page.value = data.value.pagination.totalPages
    }

    if (deleting && data.value.pagination.recordsOnPage <= 1) {
      page.value--;
    }

    isLoading.value = true;

    try {
      data.value = await volumeApi.index({ page: page.value })
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    data,
    page,
    getVolumes
  }
}
