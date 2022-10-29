<template>
  <div class="col-lg-3 col-md-4 col-xs-12">
    <q-card bordered class="full-height column">
      <q-card-section class="col-auto">
        <div class="text-h6 text-center">{{ name }}</div>
      </q-card-section>

      <q-separator dark inset />

      <q-card-section class="col">
        <ul>
          <li v-for="setting in settings" :key="setting.name">
            <strong class="q-mr-sm">{{ setting.name }}:</strong>
            <bool-check :value="true" v-if="setting.value === BOOL_TRUE"/>
            <bool-check :value="false" v-else-if="setting.value === BOOL_FALSE"/>
            <span v-else>{{ setting.value }}</span>
          </li>
        </ul>
      </q-card-section>

      <q-card-actions align="center" class="col-auto">
        <volume-form
          v-slot="{ on }"
          :volume="volume"
          :refresh="refresh"
        >
          <q-btn color="primary" icon="fa-solid fa-pencil" label="Edit" @click="on"/>
        </volume-form>

        <confirmation-dialog
          v-slot="{ on }"
          :callback="() => deleteVolume(volume, () => refresh({ deleting: true }))"
          :with-progress="true"
          :isLoading="isLoading"
          title="Confirmation"
          :message="`Are you sure that you want to delete volume: ${name}?`"
        >
          <q-btn color="negative" icon="fa-solid fa-trash" label="Delete" @click="on" class="q-ma-sm"/>
        </confirmation-dialog>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import {computed} from "vue";

const BOOL_TRUE = '__b__true';
const BOOL_FALSE = '__b__false';

import BoolCheck from "components/BoolCheck.vue";
import ConfirmationDialog from "components/ConfirmationDialog.vue";
import useVolumeDelete from "src/modules/Volume/useVolumeDelete";
import VolumeForm from "components/Volume/VolumeForm.vue";

const props = defineProps({
  volume: Object,
  refresh: Function
})

const settings = computed(() => [
  {
    name: 'Backup',
    value: props.volume.settings.backup === 1 ? 'RAID1' : BOOL_FALSE
  },
  {
    name: 'Encryption',
    value: props.volume.settings.encryption === 1 ? BOOL_TRUE : BOOL_FALSE
  },
  {
    name: 'File partition',
    value: props.volume.settings.filePartition === 1 ? 'Balanced' : 'Priority'
  }
]);

const name = computed(() => props.volume.name === '' ? 'Unnamed volume' : props.volume.name)
const { isLoading, deleteVolume } = useVolumeDelete()

</script>
