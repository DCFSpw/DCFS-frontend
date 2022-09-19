<template>
  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  >
    <router-view />
  </transition>
</template>

<script setup>

import {useStorage} from "@vueuse/core";
import {useQuasar} from "quasar";

const lightTeamOn = useStorage('light-theme', false)
const $q = useQuasar()
$q.dark.set(!lightTeamOn.value)

</script>
