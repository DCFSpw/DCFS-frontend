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
                  :disable="!creating"
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
                  :disable="!creating"
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

        <q-card-actions align="between" v-if="!isLoading" class="q-pa-md">
          <div>
            <small>
              <q-icon name="fa-solid fa-exclamation-triangle"/>
              You cannot change backup or encryption settings in the existing volume.
            </small>
          </div>
          <div>
            <q-btn label="Cancel" v-close-popup class="q-mr-sm"/>
            <q-btn color="positive" label="Create" icon="fa-solid fa-plus" @click="() => createVolume(onRefresh)" v-if="creating"/>
            <q-btn color="primary" label="Update" icon="fa-solid fa-pencil" @click="() => updateVolume(onRefresh)" v-else/>
          </div>
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
import {BACKUP, ENCRYPTION, FILE_PARTITION, FILE_PARTITION_TRANS} from "src/modules/Volume/volumeConst.js";
import {useQuasar} from "quasar";

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
const wasInitBackup = ref(false)
const $q = useQuasar()

const { isLoading, data, form, updateVolume, createVolume } = useVolumeManage()

onMounted(() => {
  if (props.volume !== null) {
    data.value = {...props.volume, settings: {...props.volume.settings}}
    wasInitBackup.value = props.volume.settings.backup === BACKUP.RAID
    creating.value = false
  }
})
const showDialog = () => showing.value = true

watch(isLoading, (newValue) => {
  if (!newValue) {
    showing.value = false
  }
})

const onRefresh = () => {
  props.refresh()
  if (!wasInitBackup.value && data.value.settings.backup === BACKUP.RAID) {
    $q.dialog({
      title: 'Information',
      html: true,
      message: "You’ve just created a volume with RAID10 backup.<br>" +
        "<br>" +
        "Please note that disks are paired into RAID1 disks in the order they were added to the volume. For example, the first disk will be paired with the second disk, the third with the fourth, etc.<br>" +
        "<br>" +
        "Therefore, pay special attention to the order in which you add disks. To ensure the best experience with RAID10 volume, make sure that subsequent disks have similar capabilities, including available space.<br>" +
        "<br>" +
        "The pairing order cannot be changed later without first removing the disks from the volume.",
      persistent: true
    })
  }
}

const backupOptions = [
  {
    label: 'RAID10',
    value: BACKUP.RAID,
  },
  {
    label: 'No backup',
    value: BACKUP.NONE,
  },
]

const encryptionOptions = [
  {
    label: 'ON',
    value: ENCRYPTION.ON,
  },
  {
    label: 'OFF',
    value: ENCRYPTION.OFF,
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
