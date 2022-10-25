<template>
  <q-page class="q-pa-lg">
    <volume-form
      v-slot="{ on }"
      :refresh="getVolumes"
    >
      <q-btn color="positive" icon="fa-solid fa-pencil" label="Add new" @click="on"/>
    </volume-form>

    <my-pagination v-model:page="page" :callback="getVolumes" :is-loading="isLoading" :pagination="data.pagination">
      <div class="q-col-gutter-lg flex row">
        <volume-item v-for="volume of data.data" :key="volume.uuid" :volume="volume" :refresh="getVolumes"/>
      </div>
    </my-pagination>
  </q-page>
</template>

<script setup>
import MyPagination from "components/MyPagination.vue";
import VolumeItem from "components/Volume/VolumeItem.vue";
import useVolumeList from "src/modules/Volume/useVolumeList";
import VolumeForm from "components/Volume/VolumeForm.vue";

const { isLoading, data, page, getVolumes } = useVolumeList()
</script>
