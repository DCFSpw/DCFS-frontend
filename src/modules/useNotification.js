import { Notify, useQuasar } from "quasar";
import { useSessionStorage } from "@vueuse/core";
import useUserSession from "src/modules/useUserSession.js";
import { computed } from "vue";

const notifications = useSessionStorage("notifications", {});

export default function () {
  const $q = useQuasar();
  const userSession = useUserSession();

  const notify = (cfg) => {
    notifications.value = {
      ...notifications.value,
      [userSession.user.uuid]: [
        { ...cfg, timestamp: Date.now(), read: false },
        ...(notifications.value[userSession.user.uuid] || []),
      ],
    };
    Notify.create(cfg);
  };

  const modal = (cfg) => $q.dialog(cfg);

  const userNotifications = computed(
    () => notifications.value[userSession.user.uuid] ?? []
  );

  const unreadUserNotificationsCount = computed(
    () => userNotifications.value.filter((n) => !n.read).length
  );

  const makeReadNotifications = () => {
    const userNotificationsCopy = [
      ...userNotifications.value.map((n) => ({ ...n, read: true })),
    ];

    notifications.value = {
      ...notifications.value,
      [userSession.user.uuid]: userNotificationsCopy,
    };
  };

  return {
    notify,
    modal,
    userNotifications,
    unreadUserNotificationsCount,
    makeReadNotifications,
  };
}
