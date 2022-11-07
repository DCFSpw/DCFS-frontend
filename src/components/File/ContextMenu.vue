<template>
  <q-menu
    touch-position
    context-menu
    @before-hide="onHide"
    @before-show="onShow"
    ref="menuRef"
  >
    <q-list dense style="min-width: 100px">

      <directory-create-dialog
        v-slot="{ on }"
        :callback="close"
      >
        <q-item clickable @click="on">
          <q-item-section>New directory</q-item-section>
        </q-item>
      </directory-create-dialog>

      <q-item clickable v-close-popup @click="getFiles">
        <q-item-section>Refresh</q-item-section>
      </q-item>

      <q-item clickable v-close-popup>
        <q-item-section>Upload</q-item-section>
      </q-item>

      <q-separator />

      <file-update-dialog
        v-if="data.file"
        v-slot="{ on }"
        :file="data.file"
        :callback="close"
      >
        <q-item v-if="data.file" clickable @click="on">
          <q-item-section>Rename</q-item-section>
        </q-item>
      </file-update-dialog>

      <confirmation-dialog
        v-if="data.file"
        v-slot="{ on }"
        :callback="() => runAndClose(() => deleteFile(data.file))"
        :with-progress="true"
        :is-loading="isLoading"
        title="Confirmation"
        :message="`Are you sure that you want to delete file: ${data.file.name}?`"
      >
        <q-item clickable @click="on">
          <q-item-section>Delete</q-item-section>
        </q-item>
      </confirmation-dialog>

      <q-separator v-if="data.file"/>

      <q-item clickable v-close-popup>
        <q-item-section>Cancel</q-item-section>
      </q-item>

    </q-list>

  </q-menu>
</template>

<script setup>
import ConfirmationDialog from "components/ConfirmationDialog.vue";
import {inject, ref} from "vue";
import useExplorer from "src/modules/File/useExplorer.js";
import FileUpdateDialog from "components/File/FileUpdateDialog.vue";
import DirectoryCreateDialog from "components/File/DirectoryCreateDialog.vue";

const { isLoading, deleteFile, selected, getFiles } = useExplorer()

const emitter = inject('emitter')
const menuRef = ref(null)
const data = ref({})

emitter.on('dcfs-show', (iData) => {
  data.value = iData
})

const close = () => menuRef.value.hide()
const runAndClose = async (callback) => {
  try {
    await callback()
  } finally {
    close()
  }
}
const onHide = () => data.value = {}

const onShow = () => {
  if (!data.value.file && selected.value) selected.value = {}
}

</script>

<style scoped>

</style>