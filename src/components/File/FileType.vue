<template>
  <div
    draggable="true"
    class="q-ma-sm q-pa-md flex column justify-center items-center file-block text-center full-height"
    :class="{ selected: selected?.uuid === file.uuid }"
    @click="onClick"
    @dblclick="onDoubleClick"
    @dragstart="onDragStart($event, file)"
    @dragover="onDragOver($event, file)"
    @drop="onDrop($event, file)"
    @contextmenu.prevent="onContextMenu(file)"
    ref="fileRef"
  >
    <q-icon :name="getIconForFile(file)" :color="file.type === 1 ? 'primary' : ''" size="lg"/>
    {{ file.name }}
  </div>
</template>

<script setup>
import {inject, ref} from "vue";
import useExplorer from "src/modules/File/useExplorer.js";
import {getIconForFile} from "src/modules/File/Extesion/helper.js";

const { moveFile, selected, goPath } = useExplorer()

const props = defineProps({
  file: Object
})

import { onClickOutside } from '@vueuse/core'

const fileRef = ref(null)
const onClick = () => selected.value = props.file

onClickOutside(fileRef, () => {
  if (selected.value.uuid === props.file.uuid) {
    selected.value = {}
  }
})

const onDoubleClick = () => {
  if (props.file.type === 1) {
    goPath(props.file)
  }
}

const onDragStart = (e, item) => {
  e.dataTransfer.setData('item', JSON.stringify(item))
  selected.value = item
}

const onDragOver = (e, item) => {
  //console.log(e.dataTransfer.items[0])
  //console.log('drag over', item)
}

const onDrop = async (e, item) => {
  e.preventDefault()
  const draggedItem = JSON.parse(e.dataTransfer.getData('item'))

  if (item.type === 1) {
    await moveFile(draggedItem, item.uuid)
  }


}
const emitter = inject('emitter')

const onContextMenu = async (item) => {
  selected.value = item
  emitter.emit('dcfs-show', { file: item })
}

</script>

<style scoped lang="scss">

.file-block {
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 5px;

  &:hover {
    //border: 1px solid rgb(212, 212, 212);
    background-color: darken(white, 5);
  }

  &.selected {
    border: 1px solid rgb(38, 38, 38);
    background-color: darken(white, 20);
  }
}

.body--dark .file-block {
  &:hover {
    background-color: lighten($dark, 5);
  }

  &.selected {
    border: 1px solid rgb(212, 212, 212);
    background-color: lighten($dark, 20);
  }
}

</style>
