<script setup>
import { useGenerateImageVariant } from "@core/composable/useGenerateImageVariant";
import misc404 from "@images/pages/404.png";
import miscMaskDark from "@images/pages/misc-mask-dark.png";
import miscMaskLight from "@images/pages/misc-mask-light.png";

const authThemeMask = useGenerateImageVariant(miscMaskLight, miscMaskDark);
</script>

<template>
  <div class="misc-wrapper">
    <ErrorHeader
      error-code="404"
      error-title="Page Not Found ⚠️"
      error-description="We couldn't find the page you are looking for."
    />

    <!-- 👉 Image -->
    <div class="misc-avatar w-100 text-center">
      <VImg :src="misc404" alt="Coming Soon" :max-width="800" class="mx-auto" />
      <VBtn to="/" class="mt-10"> Back to Home </VBtn>
    </div>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/misc.scss";

.misc-footer-tree {
  inline-size: 15.625rem;
  inset-block-end: 3.5rem;
  inset-inline-start: 0.375rem;
}
</style>

<route lang="yaml">
meta:
  layout: blank
  action: read
  subject: Auth
</route>
