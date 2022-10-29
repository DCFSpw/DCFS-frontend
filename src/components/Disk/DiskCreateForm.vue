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
                  :options="providers"
                  filled
                  v-model="data.provider"
                  label="Provider"
                  lazy-rules
                  :rules="[
                    $rules.required('Fle partition is required'),
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
          </q-form>
        </q-card-section>

        <q-card-actions align="right" v-if="!isLoading">
          <q-btn label="Cancel" v-close-popup />
          <q-btn color="positive" label="Create" icon="fa-solid fa-plus" @click="() => createDisk(refresh)"/>
        </q-card-actions>
        <q-card-actions align="center" v-else class="q-mb-sm">
          <q-spinner size="4em" color="primary"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>

import {ref, watch} from "vue";
import useDiskCreate from "src/modules/Disk/useDiskCreate";
import useProvider from "src/modules/Provider/useProvider";
import ProviderSelectItem from "components/Provider/ProviderSelectItem.vue";

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

const showDialog = () => showing.value = true

watch(isLoading, (newValue) => {
  if (!newValue) {
    showing.value = false
  }
})
</script>
