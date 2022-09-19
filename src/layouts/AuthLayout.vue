<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <transition
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
          <router-view />
        </transition>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
</script>
