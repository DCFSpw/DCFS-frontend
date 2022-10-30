<template>
  <div>
    <slot :on="showDialog"/>

    <q-dialog v-model="showing">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Editing disk</div>
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

            <disk-credentials :credentials="data.credentials" :provider="data.provider" />
          </q-form>
        </q-card-section>

        <q-card-actions align="between" v-if="!isLoading" class="q-pa-md">
          <div>
            <small>You cannot change disk provider or volume in the existing disk.</small>
          </div>
          <div>
            <q-btn label="Cancel" v-close-popup class="q-mr-sm"/>
            <q-btn color="primary" label="Update" icon="fa-solid fa-pencil" @click="() => updateDisk(refresh)"/>
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
import useDiskUpdate from "src/modules/Disk/useDiskUpdate";
import DiskCredentials from "components/Disk/DiskCredentials.vue";

const props = defineProps({
  disk: {
    type: Object,
    required: false,
    default: null
  },
  refresh: Function
})

const showing = ref(false)

const { isLoading, data, form, updateDisk } = useDiskUpdate()

onMounted(() => {
  let credentials;

  try {
    credentials = JSON.parse(props.disk.credentials)
  } catch (e) {
    credentials = {}
  }

  data.value = { ...props.disk, credentials}
})
const showDialog = () => showing.value = true

watch(isLoading, (newValue) => {
  if (!newValue) {
    showing.value = false
  }
})

</script>
