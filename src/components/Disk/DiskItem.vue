<template>
  <div class="col-lg-3 col-md-4 col-xs-12">
    <q-card bordered class="full-height column">
      <q-card-section class="col-auto">
        <div class="text-h6 text-center">{{ disk.name }}</div>
      </q-card-section>

      <q-separator inset />

      <q-card-section class="col">
        <provider-select-item :provider="disk.provider" />
        <volume-select-item :volume="disk.volume" />
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
  </div>
</template>

<script setup>
import ConfirmationDialog from "components/ConfirmationDialog.vue";
import useDiskDelete from "src/modules/Disk/useDiskDelete";
import DiskUpdateForm from "components/Disk/DiskUpdateForm.vue";
import ProviderSelectItem from "components/Provider/ProviderSelectItem.vue";
import VolumeSelectItem from "components/Volume/VolumeSelectItem.vue";
import {computed} from "vue";

const props = defineProps({
  disk: Object,
  refresh: Function
})
const { isLoading, deleteDisk } = useDiskDelete()

</script>
