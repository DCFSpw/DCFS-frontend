import { useQuasar } from "quasar";

export default function () {
  const $q = useQuasar();

  const notify = (cfg) => $q.notify(cfg);

  return {
    notify,
  };
}
