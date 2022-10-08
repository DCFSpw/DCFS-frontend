<template>
  <div>
    <q-btn
      label="Add new disk"
      @click="createDialogIsOpen = true"
      color="primary"
      icon="fa-solid fa-right-to-bracket"
    />

    <q-dialog v-model="createDialogIsOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">Create new disk</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form
            ref="form"
            greedy
          >
            <div class="row">
              <div class="col q-pa-sm">
                <q-input
                  type="text"
                  filled
                  v-model="data.name"
                  label="Name"
                  :rules="[
                    $rules.required('Name is required'),
                  ]"
                />
              </div>
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Cancel" color="negative" v-close-popup />
          <q-btn label="Create" @click="createDisk" color="primary" :loading="isLoading" icon="fa-solid fa-right-to-bracket"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import {ref} from "vue";
import useCreateDisk from "src/modules/Disk/useCreateDisk";

const { createDisk, isLoading, data, form } = useCreateDisk();
const createDialogIsOpen = ref(false);
</script>

<style scoped>

</style>
