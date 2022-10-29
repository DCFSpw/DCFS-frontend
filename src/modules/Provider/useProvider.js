import {ref} from "vue";
import providerApi from "src/api/providerApi";

const providers = ref([])

export default function() {
  const getProviders = async () => {
    if (!providers.value.length) {
      providers.value = await providerApi.index();
    }
  }

  return {
    getProviders,
    providers
  }
}
