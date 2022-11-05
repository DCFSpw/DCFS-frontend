<template>
  <div v-if="showFields">

    <div class="row">
      <div class="col q-pa-sm">
        <q-input
          type="text"
          filled
          v-model="credentials.login"
          label="Login"
          lazy-rules
          :rules="[
            $rules.required('Login is required'),
          ]"
        />
      </div>
    </div>

    <div class="row">
      <div class="col q-pa-sm">
        <q-input
          type="text"
          filled
          v-model="credentials.password"
          label="Password"
          lazy-rules
          :rules="[
            $rules.required('Password is required'),
          ]"
        />
      </div>
    </div>

    <div class="row">
      <div class="col q-pa-sm">
        <q-input
          type="text"
          filled
          v-model="credentials.host"
          label="Host"
          lazy-rules
          :rules="[
            $rules.required('Host is required'),
          ]"
        />
      </div>
    </div>

    <div class="row">
      <div class="col q-pa-sm">
        <q-input
          type="number"
          filled
          v-model="credentials.port"
          label="Port"
          lazy-rules
          :rules="[
            $rules.required('Port is required'),
          ]"
        />
      </div>
    </div>

    <div class="row">
      <div class="col q-pa-sm">
        <q-input
          type="text"
          filled
          v-model="credentials.path"
          label="Path"
          lazy-rules
          :rules="[
            $rules.required('Path is required'),
          ]"
        />
      </div>
    </div>

  </div>
</template>

<script setup>
import {computed} from "vue";
import {isOauth} from "src/modules/Provider/providerType.js";

const props = defineProps({
  credentials: Object,
  provider: Object
})

const showFields = computed(() => props.provider?.type && !isOauth(props.provider.type))

</script>
