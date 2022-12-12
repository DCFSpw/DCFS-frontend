<template>
  <q-card bordered class="full-height column">
    <q-card-section class="col-auto relative-position">
      <div class="text-h6 text-center">
        {{ disk.name }}
      </div>
      <disk-not-ready :disk="disk" />
    </q-card-section>

    <q-separator inset />

    <q-card-section class="col">
      <provider-select-item :provider="disk.provider" />
      <volume-select-item :volume="disk.volume" />

      <div class="flex flex-center items-center q-pa-sm column">
        <strong class="text-h6">Space</strong>
        <span>Total: {{ convertByteToGb(disk.totalSpace) }} GB | Free: {{ convertByteToGb(disk.freeSpace) }} GB</span>
      </div>
    </q-card-section>

    <q-card-actions align="center" class="col-auto">
      <disk-update-form
        v-slot="{ on }"
        :disk="disk"
        :refresh="refresh"
      >
        <q-btn color="primary" icon="fa-solid fa-pencil" label="Edit" @click="on"/>
      </disk-update-form>

      <confirmation-dialog
        v-slot="{ on }"
        :callback="() => deleteDisk(disk, () => refresh({ deleting: true }))"
        :with-progress="true"
        :isLoading="isLoading"
        title="Confirmation"
        :message="`Are you sure that you want to delete disk: ${disk.name}?`"
      >
        <q-btn color="negative" icon="fa-solid fa-trash" label="Delete" @click="on" class="q-ma-sm"/>
      </confirmation-dialog>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import ConfirmationDialog from "components/ConfirmationDialog.vue";
import useDiskDelete from "src/modules/Disk/useDiskDelete";
import DiskUpdateForm from "components/Disk/DiskUpdateForm.vue";
import ProviderSelectItem from "components/Provider/ProviderSelectItem.vue";
import VolumeSelectItem from "components/Volume/VolumeSelectItem.vue";
import {convertByteToGb} from "src/modules/Disk/helpers.js";
import DiskNotReady from "components/Disk/DiskNotReady.vue";

const props = defineProps({
  disk: Object,
  refresh: Function
})
const { isLoading, deleteDisk } = useDiskDelete()

</script>
