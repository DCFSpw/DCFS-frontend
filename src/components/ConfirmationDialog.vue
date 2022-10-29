<template>
  <div>
    <slot :on="showDialog"/>

    <q-dialog v-model="showing" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ title }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ message}}
        </q-card-section>

        <q-card-actions align="right" v-if="!withProgress || !isLoading">
          <q-btn label="Cancel" v-close-popup />
          <q-btn label="OK" color="primary" @click="onConfirm"/>
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

const props = defineProps({
  callback: Function,
  title: String,
  message: String,
  withProgress: {
    type: Boolean,
    default: false
  },
  isLoading: {
    type: Boolean,
    required: false
  }
})

const showing = ref(false)

const showDialog = () => showing.value = true
const onConfirm = () => {
  props.callback()

  if (!props.withProgress) {
    showing.value = false
  }
}

watch(() => props.isLoading, (newValue) => {
  if (props.withProgress && !newValue) {
    showing.value = false
  }
})
</script>
