<template>
  <q-page class="q-pa-lg">
    <disk-create-form
      v-if="!isEmpty"
      v-slot="{ on }"
      :refresh="getDisks"
    >
      <q-btn color="positive" icon="fa-solid fa-plus" label="Add new disk" class="q-ma-sm" @click="on"/>
    </disk-create-form>

    <my-pagination v-model:page="page" :callback="getDisks" :is-loading="isLoading" :pagination="data.pagination">
      <template #default>
        <div class="q-col-gutter-lg flex row">
          <div v-for="disk of data.data" :key="disk.uuid" class="col-lg-4 col-md-6 col-12">
            <disk-group v-if="disk.array?.length" :disks="disk.array" :refresh="getDisks"/>
            <disk-item v-else :disk="disk" :refresh="getDisks"/>
          </div>
        </div>
      </template>

      <template #empty>
        <div class="text-h4">
          You don't have any disks.
        </div>

        <disk-create-form
          v-slot="{ on }"
          :refresh="getDisks"
        >
          <q-btn color="positive" icon="fa-solid fa-plus" label="Add new disk" class="q-ma-sm" @click="on"/>
        </disk-create-form>
      </template>
    </my-pagination>
  </q-page>
</template>

<script setup>
import MyPagination from "components/MyPagination.vue";
import DiskItem from "components/Disk/DiskItem.vue";
import DiskGroup from "components/Disk/DiskGroup.vue";
import useDiskList from "src/modules/Disk/useDiskList";
import DiskCreateForm from "components/Disk/DiskCreateForm.vue";

const { isLoading, data, page, getDisks, isEmpty } = useDiskList()
</script>
