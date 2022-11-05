<template>
  <q-page class="q-pa-lg">
    <volume-form
      v-if="!isEmpty"
      v-slot="{ on }"
      :refresh="getVolumes"
    >
      <q-btn color="positive" icon="fa-solid fa-plus" label="Add new volume" class="q-ma-sm" @click="on"/>
    </volume-form>

    <my-pagination v-model:page="page" :callback="getVolumes" :is-loading="isLoading" :pagination="data.pagination">
      <template #default>
        <div class="q-col-gutter-lg flex row">
          <volume-item v-for="volume of data.data" :key="volume.uuid" :volume="volume" :refresh="getVolumes"/>
        </div>
      </template>

      <template #empty>
        <div class="text-h4">
          You don't have any volumes.
        </div>

        <volume-form
          v-slot="{ on }"
          :refresh="getVolumes"
        >
          <q-btn color="positive" icon="fa-solid fa-plus" label="Add new volume" class="q-ma-sm" @click="on"/>
        </volume-form>
      </template>
    </my-pagination>
  </q-page>
</template>

<script setup>
import MyPagination from "components/MyPagination.vue";
import VolumeItem from "components/Volume/VolumeItem.vue";
import useVolumeList from "src/modules/Volume/useVolumeList";
import VolumeForm from "components/Volume/VolumeForm.vue";

const { isLoading, data, page, getVolumes, isEmpty } = useVolumeList()
</script>
