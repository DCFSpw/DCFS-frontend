<template>
  <div>
    <slot :on="showDialog"/>

    <q-dialog v-model="showing">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Adding new disk</div>
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
                  v-if="selectData.length"
                  :options="selectData"
                  filled
                  v-model="data.volume"
                  label="Volume"
                  lazy-rules
                  :loading="selectLoading"
                  @virtual-scroll="loadVolumes"
                  :rules="[
                    $rules.required('Volume is required'),
                  ]"
                >
                  <template #selected>
                    <volume-select-item v-if="data.volume" :volume="data.volume" />
                  </template>

                  <template #option="scope">
                    <q-item v-bind="scope.itemProps">
                      <volume-select-item :volume="scope.opt" />
                    </q-item>
                  </template>
                </q-select>
                <q-banner v-else inline-actions class="text-white bg-red q-mb-md">
                  <q-icon name="fa-solid fa-triangle-exclamation"/> You don't have any volumes. Create volume first.
                  <template v-slot:action>
                    <q-btn
                      flat
                      color="white"
                      label="Go to volumes"
                      @click="$router.push({ name: 'volumes' })"
                    />
                  </template>
                </q-banner>
              </div>
            </div>

            <div class="row">
              <div class="col q-pa-sm">
                <q-input
                  type="number"
                  filled
                  v-model="data.totalSpace"
                  label="Total space (GB)"
                  lazy-rules
                  :rules="[
                    $rules.required('Total space is required'),
                    $rules.minValue(0.1, 'Total space cannot be lower than 0.1 GB'),
                    (val) =>
                      (val !== null && val !== '' && (new RegExp('^[0-9]+(?:.?\\d{0,1})?$')).test(val)) ||
                      'Only one decimal digit is allowed',
                  ]"
                />
              </div>
            </div>

            <div class="row">
              <div class="col q-pa-sm">
                <q-select
                  :options="providers"
                  filled
                  v-model="data.provider"
                  label="Provider"
                  lazy-rules
                  :rules="[
                    $rules.required('Provider is required'),
                  ]"
                >
                  <template #selected>
                    <provider-select-item v-if="data.provider" :provider="data.provider" />
                  </template>

                  <template #option="scope">
                    <q-item v-bind="scope.itemProps">
                      <provider-select-item :provider="scope.opt" />
                    </q-item>
                  </template>
                </q-select>
              </div>
            </div>

            <disk-credentials :provider="data.provider" :credentials="data.credentials" />
          </q-form>
        </q-card-section>

        <q-card-actions align="right" v-if="!isLoading"  class="q-pa-md">
          <q-btn label="Cancel" v-close-popup />
          <q-btn
            :disable="!selectData.length"
            color="positive"
            label="Create"
            icon="fa-solid fa-plus"
            @click="() => createDisk(refresh)"
          />
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
import useDiskCreate from "src/modules/Disk/useDiskCreate";
import useProvider from "src/modules/Provider/useProvider";
import ProviderSelectItem from "components/Provider/ProviderSelectItem.vue";
import useVolumeSelectList from "src/modules/Volume/useVolumeSelectList";
import VolumeSelectItem from "components/Volume/VolumeSelectItem.vue";
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

const { isLoading, data, form, createDisk } = useDiskCreate()
const { providers } = useProvider()
const { isLoading: selectLoading, data: selectData, loadVolumes, initialLoadVolumes } = useVolumeSelectList()

const showDialog = () => showing.value = true

onMounted(() => initialLoadVolumes())

watch(isLoading, (newValue) => {
  if (!newValue) {
    showing.value = false
  }
})
</script>
