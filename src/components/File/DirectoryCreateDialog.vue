<template>
  <div>
    <slot :on="showDialog"/>

    <q-dialog v-model="showing">
      <q-card style="width: 400px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Create directory</div>
        </q-card-section>

        <q-card-section>
          <q-form
            greedy
            ref="form"
            @submit.prevent="() => createDirectory(data)"
          >
            <div class="row">
              <div class="col q-pa-sm">
                <q-input
                  type="text"
                  filled
                  v-model="data.name"
                  label="Name"
                  ref="inputRef"
                  lazy-rules
                  :rules="[
                    $rules.required('Name is required'),
                  ]"
                />
              </div>
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions align="right" v-if="!isLoading" class="q-pa-md">
            <q-btn label="Cancel" v-close-popup class="q-mr-sm"/>
            <q-btn color="positive" label="Create" icon="fa-solid fa-pencil" @click="() => createDirectory(data)"/>
        </q-card-actions>
        <q-card-actions align="center" v-else class="q-mb-sm q-pa-md">
          <q-spinner size="4em" color="primary"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import {nextTick, onMounted, ref, watch} from "vue";
import useExplorer from "src/modules/File/useExplorer.js";

const props = defineProps({
  callback: Function
})

const data = ref({})
const { isLoading, createDirectory } = useExplorer()
const showing = ref(false)
const inputRef = ref(null)

const showDialog = () => {
  showing.value = true
  nextTick(() => inputRef.value.$el.focus())
}

watch(isLoading, (newValue) => {
  if (!newValue) {
    showing.value = false
    props.callback()
  }
})
</script>
