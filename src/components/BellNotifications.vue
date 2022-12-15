<template>
  <q-btn dense color="grey" round icon="fa-solid fa-bell" class="q-mr-sm" @click="makeReadNotifications" size="md">
    <q-badge color="red" floating v-if="unreadUserNotificationsCount">{{ unreadUserNotificationsCount }}</q-badge>

    <q-menu>
      <q-list separator>
        <q-item
          v-for="(notification, idx) in userNotifications"
          :key="idx"
          :style="`background-color: var(--q-${notification.type});`"
        >
          <q-item-section>
            <q-item-label>{{ notification.message }}</q-item-label>
            <q-item-label caption class="text-right">{{ formatDate(notification.timestamp) }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script setup>
import useNotification from "src/modules/useNotification.js";

const { userNotifications, unreadUserNotificationsCount, makeReadNotifications } = useNotification()

const formatDate = (date) => {
  date = new Date(date)
  let hours = date.getHours();
  let minutes = date.getMinutes();
  minutes = minutes < 10 ? '0'+minutes : minutes;
  const strTime = hours + ':' + minutes;
  return date.getDate() + "." + (date.getMonth()+1) + "." + date.getFullYear() + "  " + strTime;
}
</script>

<style scoped>

</style>
