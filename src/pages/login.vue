<template>
  <div>
    <!-- Title and Logo -->
    <div class="auth-logo d-flex align-start gap-x-3">
      <VNodeRenderer :nodes="themeConfig.app.logo" />

      <h1 class="font-weight-medium leading-normal text-2xl text-uppercase">
        {{ themeConfig.app.title }}
      </h1>
    </div>

    <VRow no-gutters class="auth-wrapper">
      <VCol class="auth-card-v2 d-flex align-center justify-center">
        <VCard flat class="mt-12 mt-sm-0 pa-4 w-100 loginCard">
          <VCardText>
            <h5 class="text-h6 font-weight-medium mb-2 mt-7">
              مرحباً بك في {{ themeConfig.app.title }}! 👋🏻
            </h5>
            <p class="mb-0 font-weight-bold">الرجاء تسجيل الدخول الى حسابك</p>
          </VCardText>
          <VCardText>
            <VForm @submit.prevent="login">
              <VRow>
                <!-- email -->
                <VCol cols="12">
                  <VTextField
                    v-model="form.email"
                    label="البريد الألكتروني"
                    type="email"
                  />
                </VCol>

                <!-- password -->
                <VCol cols="12">
                  <VTextField
                    v-model="form.password"
                    label="كلمة المرور"
                    :type="isPasswordVisible ? 'text' : 'password'"
                    :append-inner-icon="
                      isPasswordVisible
                        ? 'mdi-eye-off-outline'
                        : 'mdi-eye-outline'
                    "
                    @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  />

                  <div
                    class="d-flex align-center flex-wrap justify-space-between mt-1 mb-4"
                  ></div>

                  <VBtn block :loading="authStore.btnLoading" type="submit">
                    تسجيل الدخول
                  </VBtn>
                </VCol>
              </VRow>
              <VRow>
                <VCol cols="12">
                  <v-alert
                    v-if="authStore.is_error"
                    closable
                    @click:close="authStore.is_error = false"
                    icon="mdi-error"
                    type="error"
                    variant="tonal"
                    >{{ authStore.error_message }}</v-alert
                  >
                </VCol>
              </VRow>
            </VForm>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { ref } from "vue";

import { VNodeRenderer } from "@layouts/components/VNodeRenderer";
import { themeConfig } from "@themeConfig";

const form = ref({
  email: "",
  password: "",
  remember: false,
});

const isPasswordVisible = ref(false);

const authStore = useAuthStore();

const login = () => {
  authStore.submitLogin({
    email: form.value.email,
    password: form.value.password,
  });
};
</script>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
@use "@/styles/mixins" as *;

.loginCard {
  @include minQuery(500px) {
    inline-size: 75% !important;
  }

  .forgot {
    border-block-end: solid 1px;
  }
}
</style>

<route lang="yaml">
meta:
  layout: blank
</route>
