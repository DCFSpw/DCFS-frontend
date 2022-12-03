<template>
  <q-page class="q-pa-lg">
    <div class="q-col-gutter-lg flex row">

      <div class="col-lg-6 col-md-6 col-xs-12 col-sm-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">Edit Profile</div>
          </q-card-section>

          <q-card-section class="q-pa-sm">
            <q-form
              greedy
              ref="profileForm"
            >
              <div class="row">
                <div class="col q-pa-sm">
                  <q-input
                    type="text"
                    filled
                    v-model="profileData.firstName"
                    label="First name"
                    lazy-rules
                    :rules="[
                      $rules.required('First name is required'),
                    ]"
                  />
                </div>
              </div>

              <div class="row">
                <div class="col q-pa-sm">
                  <q-input
                    type="text"
                    filled
                    v-model="profileData.lastName"
                    label="Last name"
                    lazy-rules
                    :rules="[
                      $rules.required('Last name is required'),
                    ]"
                  />
                </div>
              </div>
            </q-form>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              label="Update"
              type="submit"
              color="primary"
              :loading="profileLoading"
              @click="updateProfile"
              icon="fa-solid fa-pen-to-square"
              :disabled="!dataChanged"
            />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-lg-6 col-md-6 col-xs-12 col-sm-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">Change Password</div>
          </q-card-section>
          <q-card-section class="q-pa-sm">
            <q-form
              greedy
              ref="changePasswordForm"
            >
              <div class="row">
                <div class="col q-pa-sm">
                  <q-input
                    type="password"
                    filled
                    v-model="changePasswordData.oldPassword"
                    label="Current password"
                    lazy-rules
                    :rules="[
                      $rules.required('Current password is required'),
                      $rules.maxLength(PASSWORD_MAX, `Current password cannot be longer than ${PASSWORD_MAX} characters`),
                      $rules.minLength(PASSWORD_MIN, `Current password cannot be shorter than ${PASSWORD_MIN} characters`),
                    ]"
                  />
                </div>
              </div>

              <div class="row">
                <div class="col q-pa-sm">
                  <q-input
                    type="password"
                    filled
                    v-model="changePasswordData.newPassword"
                    label="New password"
                    lazy-rules
                    :rules="[
                      $rules.required('New password is required'),
                      $rules.maxLength(PASSWORD_MAX, `New password cannot be longer than ${PASSWORD_MAX} characters`),
                      $rules.minLength(PASSWORD_MIN, `New password cannot be shorter than ${PASSWORD_MIN} characters`),
                    ]"
                  />
                </div>
              </div>

              <div class="row">
                <div class="col q-pa-sm">
                  <q-input
                    type="password"
                    filled
                    v-model="changePasswordData.newPasswordConfirm"
                    label="Confirm new password"
                    lazy-rules
                    :rules="[
                      $rules.required('New password confirm is required'),
                      $rules.sameAs(changePasswordData.newPassword, 'Repeated password is not the same')
                    ]"
                  />
                </div>
              </div>
            </q-form>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              label="Change"
              type="submit"
              color="primary"
              :loading="changePasswordLoading"
              @click="changePassword"
              icon="fa-solid fa-pen-to-square"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>

import { PASSWORD_MAX, PASSWORD_MIN } from "src/validation/const";

import {onMounted} from "vue";
import useChangePassword from "src/modules/UserProfile/useChangePassword";
import useProfileInfo from "src/modules/UserProfile/useProfileInfo";

const {
  form: profileForm,
  data: profileData,
  isLoading: profileLoading,
  updateProfile,
  getProfile,
  dataChanged
} = useProfileInfo()

const {
  form: changePasswordForm,
  data: changePasswordData,
  isLoading: changePasswordLoading,
  changePassword
} = useChangePassword()

onMounted(() => getProfile())

</script>
