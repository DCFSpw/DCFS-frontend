<template>
  <q-card class="auth-card">
    <q-card-section class="flex justify-end">
      <q-avatar size="103px" class="absolute-center shadow-10">
        <img src="~assets/profile.svg">
      </q-avatar>
      <div>
        <theme-switch/>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="text-center q-pt-lg">
        <div class="col text-h6 ellipsis">
          Register
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <q-form
        ref="form"
        greedy
        @submit="onSubmit"
      >
        <div class="row">
          <div class="col-xs-12 col-md-6 q-pa-sm">
            <q-input
              filled
              v-model="data.firstName"
              label="First name"
              lazy-rules
              :rules="[
                $rules.required('First name is required'),
                $rules.maxLength(FIRST_NAME_MAX, `First name cannot be longer than ${FIRST_NAME_MAX} characters`)
              ]"
            />
          </div>
          <div class="col-xs-12 col-md-6 q-pa-sm">
            <q-input
              filled
              v-model="data.lastName"
              label="Last name"
              lazy-rules
              :rules="[
                $rules.required('Last name is required'),
                $rules.maxLength(LAST_NAME_MAX, `Last name cannot be longer than ${LAST_NAME_MAX} characters`)
              ]"
            />
          </div>
        </div>

        <div class="row">
          <div class="col q-pa-sm">
            <q-input
              type="email"
              filled
              v-model="data.email"
              label="Email"
              lazy-rules
              :rules="[
                $rules.required('Email is required'),
                $rules.email('Field should be a valid email address'),
                $rules.maxLength(EMAIL_MAX, `Email cannot be longer than ${EMAIL_MAX} characters`)
              ]"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-xs-12 col-md-6 q-pa-sm">
            <q-input
              type="password"
              filled
              v-model="data.password"
              label="Password"
              lazy-rules
              :rules="[
                $rules.required('Password is required'),
                $rules.maxLength(PASSWORD_MAX, `Password cannot be longer than ${PASSWORD_MAX} characters`),
                $rules.minLength(PASSWORD_MIN, `Password cannot be shorter than ${PASSWORD_MIN} characters`),
              ]"
            />
          </div>
          <div class="col-xs-12 col-md-6 q-pa-sm">
            <q-input
              type="password"
              filled
              v-model="data.passwordRepeat"
              label="Repeat password"
              lazy-rules
              :rules="[
                $rules.sameAs(data.password, 'Repeated password is not the same')
              ]"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-xs-12 col-md-6 q-pa-sm">
            <q-btn
              label="Register"
              type="submit"
              color="primary"
              :loading="isLoading"
              icon="fa-solid fa-user-plus"
            />
          </div>
          <div class="col-xs-12 col-md-6 q-pa-sm flex justify-end items-center">
            <a @click="$router.push({ name: 'login' })" class="underline-link">
              Already have an account? Login now!
            </a>
          </div>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>

import { EMAIL_MAX, PASSWORD_MAX, PASSWORD_MIN, FIRST_NAME_MAX, LAST_NAME_MAX } from "src/validation/const";

import {reactive, ref} from "vue"
import authApi from "src/api/authApi";
import useAuth from "src/modules/useAuth";
import ThemeSwitch from "components/ThemeSwitch.vue";

const auth = useAuth();

const data = reactive({
  email: '',
  password: '',
  passwordRepeat: '',
  firstName: '',
  lastName: ''
})
const form = ref(null)
const isLoading = ref(false)

const onSubmit = async () => {
  isLoading.value = true

  try {
    const { passwordRepeated, ...apiData } = data
    await authApi.register(apiData)
    await auth.register()
  } finally {
    isLoading.value = false
  }
}

</script>
