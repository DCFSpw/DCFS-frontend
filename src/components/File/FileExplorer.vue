<template>
  <q-page class="q-pa-lg">
    <div class="row full-width q-col-gutter-y-md">
      <div class="column col-xl-1 col-sm-4 col-12">
        <utility-buttons/>
      </div>
      <div class="column col-xl-8 col-sm-8 col-12">
        <bread-crumbs/>
      </div>
      <div class="column col-xl-3 col-12">
        <volume-select/>
      </div>
    </div>

    <div class="row justify-center q-mt-lg q-pt-lg" v-if="initializing">
      <q-spinner size="40px"/>
    </div>

    <div class="row justify-center q-mt-lg" v-else-if="volume && !volume.isReady">
      <div class="column col-xl-4 col-sm-6 col-12">
        <q-banner>
          <template v-slot:avatar>
            <q-icon name="fa-solid fa-exclamation-triangle" color="warning" />
          </template>
          Volume is not fully configured. Attach disks to volume.
          <template v-slot:action>
            <q-btn flat color="primary" label="Disks settings" @click="() => router.push({ name: 'disks' })"/>
          </template>
        </q-banner>
      </div>

    </div>

    <div v-else>
      <transition-group
        v-if="computedFiles.length"
        class="flex full-width full-height q-mt-lg row items-stretch"
        enter-active-class="animated fadeIn"
        tag="div"
      >
        <div v-for="file in computedFiles" :key="file.uuid" class="col-xl-1 col-lg-2 col-md-3 col-sm-6 col-12">
          <file-type :file="file" />
        </div>
      </transition-group>
      <div class="text-center q-mt-lg" v-else>
        <span class="text-h6">{{ noFileMsg }}</span>
      </div>
    </div>

    <context-menu v-if="volume.isReady"/>
  </q-page>
</template>

<script setup>

import VolumeSelect from "components/File/VolumeSelect.vue";
import BreadCrumbs from "components/File/BreadCrumbs.vue";
import useExplorer from "src/modules/File/useExplorer.js";
import FileType from "components/File/FileType.vue";
import ContextMenu from "components/File/ContextMenu.vue";
import {computed, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import useVolumeSelectList from "src/modules/Volume/useVolumeSelectList.js";
import useUploadFile from "src/modules/File/useUploadFile.js";
import UtilityButtons from "components/File/UtilityButtons.vue";

const { isLoading, volume, files, getFiles, setRootFromApi, root, search } = useExplorer()
const { uploadingFiles } = useUploadFile()
const { getVolume } = useVolumeSelectList()

const route = useRoute()
const router = useRouter()
const initializing = ref(false)

const noFileMsg = computed(() => {
  if (!volume.value) return 'No volumes found. Please go to `Volumes` tab to create your first volume.'
  if (search.value !== '' && files.value.length) return 'No files matching the filter criteria'
  return 'No files found'
})

const computedFiles = computed(() => {
  let newFiles = [...files.value]

  const rootUuid = root.value.uuid ?? 0;
  const volumeUuid = volume.value.uuid

  if (uploadingFiles.value[volumeUuid] && uploadingFiles.value[volumeUuid][rootUuid])
    newFiles = [...newFiles, ...Object.values(uploadingFiles.value[volumeUuid][rootUuid])]

  if (search.value !== '')
    newFiles = newFiles.filter(file => file.name.toLowerCase().includes(search.value.toLowerCase()))

  return newFiles.sort((a, b) => a.type > b.type ? 1 : -1)
})

// Handle route changing for example when going back in browser
watch(route, async (route) => {
  initializing.value = true
  if (route.name !== 'dashboard') return

  const newVolumeUuid = route.query.volumeUuid
  const newRootUuid = route.query.rootUuid
  if (newVolumeUuid !== volume.value.uuid || newRootUuid !== root.value?.uuid) {
    if (newVolumeUuid !== volume.value.uuid && newVolumeUuid)
      volume.value = await getVolume(newVolumeUuid)

    if (newRootUuid !== root.value?.uuid)
      await setRootFromApi()

    await getFiles()
  }

  initializing.value = false
})
</script>
