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
          </q-form>
        </q-card-section>

        <q-card-actions align="right" v-if="!isLoading">
          <q-btn label="Cancel" v-close-popup />
          <q-btn color="primary" label="Update" icon="fa-solid fa-pencil" @click="() => updateDisk(refresh)"/>
        </q-card-actions>
        <q-card-actions align="center" v-else class="q-mb-sm">
          <q-spinner size="4em" color="primary"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>

import {onMounted, ref, watch} from "vue";
import useDiskUpdate from "src/modules/Disk/useDiskUpdate";

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
  data.value = {...props.disk, credentials: {...props.disk.credentials}}
})
const showDialog = () => showing.value = true

watch(isLoading, (newValue) => {
  if (!newValue) {
    showing.value = false
  }
})

</script>
