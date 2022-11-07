<template>
  <div
    draggable="true"
    class="q-ma-sm q-pa-lg flex column justify-center items-center file-block"
    :class="{ selected }"
    @click="onClick"
    @dblclick="onDoubleClick"
    @dragstart="onDragStart($event, file)"
    @dragover="onDragOver($event, file)"
    @drop="onDrop($event, file)"
  >
    <q-icon :name="file.type === 1 ? 'fa-solid fa-folder' : 'fa-solid fa-file'" size="lg"/>
    {{ file.name }}
  </div>
</template>

<script setup>
import {ref} from "vue";
import useExplorer from "src/modules/File/useExplorer.js";

const {root, setQueryParams, moveFile} = useExplorer()

const props = defineProps({
  file: Object
})

const selected = ref(false)

const onClick = () => selected.value = !selected.value
const onDoubleClick = () => {
  if (props.file.type === 1) {
    root.value = props.file;
    setQueryParams()
  }
}

const onDragStart = (e, item) => {
  e.dataTransfer.setData('item', JSON.stringify(item))
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

  console.log('drop', item)
}

</script>

<style scoped lang="scss">

.file-block {
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 5px;

  &:hover {
    //border: 1px solid rgb(212, 212, 212);
    background-color: lighten($dark, 5);
  }

  &.selected {
    border: 1px solid rgb(212, 212, 212);
    background-color: lighten($dark, 20);
  }
}

</style>
