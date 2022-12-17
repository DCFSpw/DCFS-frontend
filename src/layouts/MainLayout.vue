<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Distributed Cloud File System
        </q-toolbar-title>

        <div class="q-ml-md">
          <bell-notifications/>

          <q-btn dense color="grey" round icon="fa-solid fa-user" class="q-mr-sm" size="md">
            <q-menu>
              <div class="row no-wrap q-pt-md justify-center">
                Hello {{ user.firstName }} {{ user.lastName }}!
              </div>
              <div class="row no-wrap q-pa-md">
                <div class="column justify-center">
                  <theme-switch/>
                </div>

                <q-separator vertical inset class="q-mx-lg" />

                <div class="items-center justify-center column">
                  <div class="q-ma-sm row">
                    <q-btn
                      @click="() => router.push({ name: 'profile' })"
                      color="primary"
                      size="sm"
                      v-close-popup
                      label="Profile"
                      icon="fa-solid fa-user-pen"
                    />
                  </div>
                  <div class="q-ma-sm row">
                    <q-btn
                      @click="logout"
                      color="primary"
                      size="sm"
                      v-close-popup
                      label="Logout"
                      icon="fa-solid fa-right-from-bracket"
                    />
                  </div>
                </div>
              </div>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      elevated
      :width="200"
      :breakpoint="500"
    >
      <q-scroll-area class="fit">
        <q-list>
          <template v-for="(menuItem, index) in menuList" :key="index">
            <q-item
              clickable
              :active="menuItem.route === route.name"
              v-ripple
              :to="{name: menuItem.route }"
            >
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" />
              </q-item-section>
              <q-item-section>
                {{ menuItem.label }}
              </q-item-section>
            </q-item>
            <q-separator :key="'sep' + index"  v-if="menuItem.separator" />
          </template>
        </q-list>
      </q-scroll-area>

      <div class="absolute-bottom q-pa-sm" style="font-size: .7em">
          <div style="font-size: 1.2em">@Authors</div>
          <div>Tymoteusz Bartnik</div>
          <div>Przemysław Dominikowski</div>
          <div>Bartosz Błachut</div>
      </div>
    </q-drawer>

    <q-page-container>
      <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <router-view />
      </transition>
    </q-page-container>

    <upload-progress/>
  </q-layout>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import ThemeSwitch from "components/ThemeSwitch.vue";
import {useRoute, useRouter} from "vue-router";
import useUserSession from "src/modules/useUserSession";
import useProvider from "src/modules/Provider/useProvider";
import UploadProgress from "components/File/UploadProgress.vue";
import useLogout from "src/modules/Auth/useLogout.js";
import BellNotifications from "components/BellNotifications.vue";

const menuList = [
  {
    icon: 'fa-solid fa-house',
    label: 'Home',
    route: 'dashboard',
    separator: true
  },
  {
    icon: 'fa-solid fa-user-pen',
    label: 'Profile',
    route: 'profile',
    separator: false
  },
  {
    icon: 'fa-solid fa-save',
    label: 'Volumes',
    route: 'volumes',
    separator: false
  },
  {
    icon: 'fa-solid fa-server',
    label: 'Disks',
    route: 'disks',
    separator: false
  }
]

const leftDrawerOpen = ref(false)
const {logout} = useLogout()
const router = useRouter()
const route = useRoute()
const { user } = useUserSession()
const toggleLeftDrawer = () => leftDrawerOpen.value = !leftDrawerOpen.value

const { getProviders } = useProvider()

onMounted(() => getProviders())
</script>
