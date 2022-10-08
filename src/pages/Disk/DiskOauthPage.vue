<template>
  <div>
    <q-inner-loading
      :showing="true"
      label="Authorizing oauth"
    />
  </div>
</template>

<script setup>

import useDiskOauth from "src/modules/Disk/useDiskOauth";
import {onMounted} from "vue";

const { checkOauth } = useDiskOauth()

onMounted(() => checkOauth())
</script>
