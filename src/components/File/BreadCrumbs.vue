<template>
  <div class="q-pa-md explorer-nav q-mx-sm row">
    <div class="col-xl-9 col-12 flex items-center justify-start">
      <q-breadcrumbs>
        <q-breadcrumbs-el
          icon="home"
          :label="getName(volume.name)"
          style="cursor: pointer;"
          @click="goPath(null)"
          @drop="onDrop($event, null)"
        />

        <q-breadcrumbs-el v-if="showDots" label="..."/>

        <q-breadcrumbs-el
          v-for="p in sanitizedPath"
          style="cursor: pointer;"
          :key="p.uuid"
          :label="getName(p.name)"
          @click="goPath(p)"
          @drop="onDrop($event, p)"
        />

        <q-breadcrumbs-el v-if="root" :label="getName(root.name)"/>
      </q-breadcrumbs>
    </div>

    <div class="desktop-only col-xl-3 col-12">
      <q-input
        dense
        v-model="search"
        class="small-input"
        input-class="text-right"
        @focus="onFocus"
        @blur="() => onFocus(false)"
        :borderless="!focused"
      >
        <template v-slot:append>
          <q-icon v-if="search === ''" class="cursor-pointer" name="search" size="18px"/>
          <q-icon v-else name="clear" class="cursor-pointer" size="18px" @click="search = ''" />
        </template>
      </q-input>
    </div>
  </div>
</template>

<script setup>
import useExplorer from "src/modules/File/useExplorer.js";
import {useRouter} from "vue-router";
import {computed, ref} from "vue";

const MAX_BREADCRUMB_ITEMS = 5
const MAX_ITEM_NAME = 15

const {volume, root, path, goPath, moveFile, search } = useExplorer()
const router = useRouter()

const focused = ref(false)
const onFocus = (f = true) => focused.value = f

const showDots = computed(() => path.value?.length > MAX_BREADCRUMB_ITEMS)
const sanitizedPath = computed(() => {
  if (path.value?.length > MAX_BREADCRUMB_ITEMS) {
    return path.value.slice(-MAX_BREADCRUMB_ITEMS)
  }

  return path.value
})

const getName = (name) => {
  return name?.length > MAX_ITEM_NAME + 3
    ? name.substring(0, MAX_ITEM_NAME) + '...'
    : name
}

const onDrop = async (e, item) => {
  e.preventDefault()

  const draggedItem = JSON.parse(e.dataTransfer.getData('item'))

  if (item?.uuid !== draggedItem.uuid && item?.uuid !== root.value.uuid) {
    await moveFile(draggedItem, item?.uuid ?? null)
  }
}
</script>
