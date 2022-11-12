<template>
  <div>
    <slot :on="showDialog"/>

    <q-dialog v-model="showing">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6" v-if="creating">Adding new volume</div>
          <div class="text-h6" v-else>Editing volume</div>
        </q-card-section>

        <q-card-section>
          <q-form
            greedy
            ref="form"
          >
            <div class="row">
              <div class="col q-pa-sm">
                <q-input
                  type="text"
                  filled
                  v-model="data.name"
                  label="Name"
                  lazy-rules
                  :rules="[
                  $rules.required('Name is required'),
                ]"
                />
              </div>
            </div>
            <div class="row">
              <div class="col q-pa-sm">
                <q-select
                  :options="backupOptions"
                  filled
                  v-model="data.settings.backup"
                  label="Backup"
                  lazy-rules
                  map-options
                  emit-value
                  :rules="[
                    $rules.required('Backup is required'),
                  ]"
                />
              </div>
            </div>
            <div class="row">
              <div class="col q-pa-sm">
                <q-select
                  :options="encryptionOptions"
                  filled
                  v-model="data.settings.encryption"
                  label="Encryption"
                  lazy-rules
                  map-options
                  emit-value
                  :rules="[
                    $rules.required('Encryption is required'),
                  ]"
                />
              </div>
            </div>
            <div class="row">
              <div class="col q-pa-sm">
                <q-select
                  :options="filePartitionOptions"
                  filled
                  v-model="data.settings.filePartition"
                  label="File partition"
                  lazy-rules
                  map-options
                  emit-value
                  :rules="[
                    $rules.required('Fle partition is required'),
                  ]"
                />
              </div>
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions align="right" v-if="!isLoading" class="q-pa-md">
          <q-btn label="Cancel" v-close-popup />
          <q-btn color="positive" label="Create" icon="fa-solid fa-plus" @click="() => createVolume(refresh)" v-if="creating"/>
          <q-btn color="primary" label="Update" icon="fa-solid fa-pencil" @click="() => updateVolume(refresh)" v-else/>
        </q-card-actions>
        <q-card-actions align="center" v-else class="q-mb-sm q-pa-md">
          <q-spinner size="4em" color="primary"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>

import {onMounted, ref, watch} from "vue";
import useVolumeManage from "src/modules/Volume/useVolumeManage";
import {FILE_PARTITION, FILE_PARTITION_TRANS} from "src/modules/Volume/volumeConst.js";

const props = defineProps({
  volume: {
    type: Object,
    required: false,
    default: null
  },
  refresh: Function
})

const showing = ref(false)
const creating = ref(true)

const { isLoading, data, form, updateVolume, createVolume } = useVolumeManage()

onMounted(() => {
  if (props.volume !== null) {
    data.value = {...props.volume, settings: {...props.volume.settings}}
    creating.value = false
  }
})
const showDialog = () => showing.value = true

watch(isLoading, (newValue) => {
  if (!newValue) {
    showing.value = false
  }
})

const backupOptions = [
  {
    label: 'RAID1',
    value: 1,
  },
  {
    label: 'No backup',
    value: 2,
  },
]

const encryptionOptions = [
  {
    label: 'ON',
    value: 1,
  },
  {
    label: 'OFF',
    value: 2,
  },
]

const filePartitionOptions = [
  {
    label: FILE_PARTITION_TRANS[FILE_PARTITION.BALANCED],
    value: FILE_PARTITION.BALANCED,
  },
  {
    label: FILE_PARTITION_TRANS[FILE_PARTITION.PRIORITY],
    value: FILE_PARTITION.PRIORITY,
  },
  {
    label: FILE_PARTITION_TRANS[FILE_PARTITION.THROUGHPUT],
    value: FILE_PARTITION.THROUGHPUT,
  },
]

</script>
