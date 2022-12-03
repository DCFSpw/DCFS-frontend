import { ref } from "vue";
import volumeApi from "src/api/volumeApi";
import Quasar from "quasar";

export default function () {
  const isLoading = ref(false);
  const data = ref({ settings: {} });
  const form = ref(null);

  const makeAction = async (refresh, action) => {
    if (!(await form.value.validate())) {
      return false;
    }

    isLoading.value = true;

    try {
      await action(data.value);
      await refresh();
      return true;
    } finally {
      isLoading.value = false;
    }
  };

  const updateVolume = async (refresh) => {
    if (await makeAction(refresh, (data) => volumeApi.update(data.uuid, data)))
      Quasar.Notify.create({
        type: "positive",
        message: "Volume has been updated",
      });
  };

  const createVolume = async (refresh) => {
    if (
      await makeAction(
        () => refresh({ toLastPage: true }),
        (data) => volumeApi.create(data)
      )
    ) {
      data.value = { settings: {} };
      Quasar.Notify.create({
        type: "positive",
        message: "Volume has been created",
      });
    }
  };

  return {
    isLoading,
    data,
    form,
    updateVolume,
    createVolume,
  };
}
