<script setup>
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import authV2LoginIllustrationBorderedDark from '@images/pages/auth-v2-login-illustration-bordered-dark.png'
import authV2LoginIllustrationBorderedLight from '@images/pages/auth-v2-login-illustration-bordered-light.png'
import authV2LoginIllustrationDark from '@images/pages/auth-v2-login-illustration-dark.png'
import authV2LoginIllustrationLight from '@images/pages/auth-v2-login-illustration-light.png'
import authV2MaskDark from '@images/pages/auth-v2-mask-dark.png'
import authV2MaskLight from '@images/pages/auth-v2-mask-light.png'
import tree from '@images/pages/tree.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'

const router = useRouter()

const form = ref({
  email: '',
  password: '',
  remember: false,
})

const isPasswordVisible = ref(false)
const authThemeImg = useGenerateImageVariant(authV2LoginIllustrationLight, authV2LoginIllustrationDark, authV2LoginIllustrationBorderedLight, authV2LoginIllustrationBorderedDark, true)
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)
</script>

<template>
  <div>
    <!-- Title and Logo -->
    <div class="auth-logo d-flex align-start gap-x-3">
      <VNodeRenderer :nodes="themeConfig.app.logo" />

      <h1 class="font-weight-medium leading-normal text-2xl text-uppercase">
        {{ themeConfig.app.title }}
      </h1>
    </div>

    <VRow
      no-gutters
      class="auth-wrapper"
    >

      <VCol
        class="auth-card-v2 d-flex align-center justify-center"
      >
        <VCard
          flat
          class="mt-12 mt-sm-0 pa-4 w-100 loginCard"
        >
          <VCardText>
            <h5 class="text-h6 font-weight-medium mb-2 mt-7">
              مرحباً بك في {{ themeConfig.app.title }}! 👋🏻
            </h5>
            <p class="mb-0 font-weight-bold">
              الرجاء تسجيل الدخول الى حسابك
            </p>
          </VCardText>
          <VCardText>
            <VForm @submit.prevent="router.push('/')">
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
                    :append-inner-icon="isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                    @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  />

                  <div class="d-flex align-center flex-wrap justify-space-between mt-1 mb-4">
                    <a
                      class="text-primary forgot mt-2"
                      href="#"
                    >
                      نسيت رمز الحساب ؟
                    </a>
                  </div>

                  <VBtn
                    block
                    type="submit"
                  >
                    تسجيل الدخول
                  </VBtn>
                </VCol>
              </VRow>
            </VForm>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
@use '@/styles/mixins' as *;
.loginCard{
  @include minQuery(500px){
    width: 75% !important;
  }
  .forgot{
    border-bottom: solid 1px;
  }
}
</style>

<route lang="yaml">
meta:
  layout: blank
</route>
