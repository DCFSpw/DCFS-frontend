<template>
  <q-card bordered class="full-height column">
    <q-card-section class="col-auto">
      <div class="text-h6 text-center">RAID disk group</div>
    </q-card-section>

    <q-separator inset />

    <q-card-section class="row card-inside-wrapper">
      <div class="column col-6 card-inside column" v-for="disk in disks" :key="disk.uuid">
        <div class="text-h6 text-center col-auto relative-position">
          {{ disk.name }}
          <disk-not-ready :disk="disk" />
        </div>
        <q-separator inset />

        <div class="col">
          <provider-select-item :provider="disk.provider" />
          <volume-select-item :volume="disk.volume" />

          <div class="flex flex-center items-center q-pa-sm column">
            <strong class="text-h6">Space</strong>
            <span>Total: {{ convertByteToGb(disk.totalSpace) }} GB | Free: {{ convertByteToGb(disk.freeSpace) }} GB</span>
          </div>
        </div>

        <div class="flex justify-center items-center col-auto">
          <disk-update-form
            v-slot="{ on }"
            :disk="disk"
            :refresh="refresh"
          >
            <q-btn color="primary" icon="fa-solid fa-pencil" @click="on"/>
          </disk-update-form>
          <confirmation-dialog
            v-slot="{ on }"
            :callback="() => replaceDisk(disk, () => refresh({ deleting: true }))"
            :with-progress="true"
            :isLoading="isLoading"
            title="Confirmation"
            :message="`Are you sure that you want to replace disk: ${disk.name} in this RAID group?`"
          >
            <q-btn color="secondary" icon="fa-solid fa-arrow-up-right-from-square" @click="on" class="q-ma-sm"/>
          </confirmation-dialog>
        </div>
      </div>

    </q-card-section>

    <q-card-actions align="center">
      <confirmation-dialog
        v-slot="{ on }"
        :callback="() => deleteDisk(disks.at(0), () => refresh({ deleting: true }))"
        :with-progress="true"
        :isLoading="isLoading"
        title="Confirmation"
        :message="`Are you sure that you want to delete all disks in this group?`"
      >
        <q-btn color="negative" icon="fa-solid fa-trash" @click="on" class="q-ma-sm" label="Delete group"/>
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
  disks: Array,
  refresh: Function
})
const { isLoading, deleteDisk, replaceDisk } = useDiskDelete()

</script>

<style lang="scss">
.body--dark {
  .card-inside-wrapper {
    .card-inside {
      background-color: lighten(#1D1D1D, 5%);
      border-radius: 5px;

      &:first-child {
        border-right: 4px solid #1D1D1D;
      }

      &.last-child {
        border-left: 4px solid #1D1D1D;
      }
    }
  }
}

.card-inside-wrapper {
  .card-inside {
    background-color: darken(#fff, 3%);
    border-radius: 5px;

    &:first-child {
      border-right: 4px solid #fff;
    }

    &.last-child {
      border-left: 4px solid #fff;
    }
  }
}


</style>
