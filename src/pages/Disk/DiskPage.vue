<template>
  <q-page class="q-pa-lg">
    <disk-create-form
      v-slot="{ on }"
      :refresh="getDisks"
    >
      <q-btn color="positive" icon="fa-solid fa-plus" label="Add new disk" class="q-ma-sm" @click="on"/>
    </disk-create-form>

    <my-pagination v-model:page="page" :callback="getDisks" :is-loading="isLoading" :pagination="data.pagination">
      <div class="q-col-gutter-lg flex row">
        <disk-item v-for="disk of data.data" :key="disk.uuid" :disk="disk" :refresh="getDisks"/>
      </div>
    </my-pagination>
  </q-page>
</template>

<script setup>
import MyPagination from "components/MyPagination.vue";
import DiskItem from "components/Disk/DiskItem.vue";
import useDiskList from "src/modules/Disk/useDiskList";
import DiskCreateForm from "components/Disk/DiskCreateForm.vue";

const { isLoading, data, page, getDisks } = useDiskList()
</script>
