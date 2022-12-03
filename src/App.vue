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
import {provide} from "vue";
import mitt from "mitt";

const emitter = mitt();
provide('emitter', emitter)

const lightTeamOn = useStorage('light-theme', false)
const $q = useQuasar()
$q?.dark?.set(!lightTeamOn.value)

</script>
