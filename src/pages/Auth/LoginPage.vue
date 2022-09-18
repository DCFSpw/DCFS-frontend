<template>
  <q-card v-bind:style="$q.screen.lt.sm?{'width': '80%'}:{'width':'30%'}">
    <q-card-section>
      <q-avatar size="103px" class="absolute-center shadow-10">
        <img src="~assets/profile.svg">
      </q-avatar>
    </q-card-section>
    <q-card-section>
      <div class="text-center q-pt-lg">
        <div class="col text-h6 ellipsis">
          Log in
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <q-form
        class="q-gutter-md"
        ref="form"
        greedy
      >
        <q-input
          filled
          v-model="username"
          label="Username"
          lazy-rules
          :rules="[
            $rules.required('Username is required')
          ]"
        />

        <q-input
          type="password"
          filled
          v-model="password"
          label="Password"
          lazy-rules
          :rules="[
            $rules.required('Password is required')
          ]"
        />

        <div>
          <q-btn label="Login" @click="onSubmit" color="primary" :loading="isLoading"/>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>

import {ref} from "vue"
import {useQuasar} from "quasar"
import {useRouter} from "vue-router";
import useUserSession from "src/modules/useUserSession";

const $q = useQuasar()
const router = useRouter()
const userSession = useUserSession()

const username = ref('')
const password = ref('')
const form = ref(null)
const isLoading = ref(false)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const onSubmit = async () => {
  const valid = await form.value.validate()
  if (!valid) return

  isLoading.value = true
  await sleep(1000)
  isLoading.value = false

  if (username.value !== 'john@doe.com' || password.value !== 'password') {
    $q.notify({ type: 'negative', message: 'Provided username or password is incorrect!' })
    return
  }

  $q.notify({ type: 'positive', message: 'Successfully logged in!' })
  userSession.token = '1234'
  userSession.user = {
    name: 'John',
    surname: 'Doe'
  }

  await router.push('/')
}

</script>
