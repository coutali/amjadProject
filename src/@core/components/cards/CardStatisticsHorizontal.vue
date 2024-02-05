<script setup>
import { kFormatter } from '@core/utils/formatters'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: false,
    default: 'primary',
  },
  icon: {
    type: String,
    required: true,
  },
  stats: {
    type: Number,
    required: true,
  },
  change: {
    type: Number,
    required: true,
  },
})

const isPositive = controlledComputed(() => props.change, () => Math.sign(props.change) === 1)
</script>

<template>
  <VCard
    variant="text"
    border
  >
    <VCardText class="d-flex align-center">
      <VAvatar
        size="40"
        rounded
        class="elevation-2 me-3"
        style="background-color: rgb(var(--v-theme-surface));"
      >
        <VIcon
          :color="props.color"
          :icon="props.icon"
          :size="24"
        />
      </VAvatar>

      <div>
        <span class="text-caption">{{ props.title }}</span>
        <div class="d-flex align-center flex-wrap">
          <span class="text-h6">{{ kFormatter(props.stats) }}</span>
          <div
            v-if="props.change"
            :class="`${isPositive ? 'text-success' : 'text-error'} mt-1`"
          >
            <VIcon
              :icon="isPositive ? 'mdi-chevron-up' : 'mdi-chevron-down'"
              size="24"
            />
            <span class="text-xs">{{ Math.abs(props.change) }}%</span>
          </div>
        </div>
      </div>
    </VCardText>
  </VCard>
</template>

<style lang="scss">
.skin--bordered {
  .v-avatar {
    border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
    box-shadow: none !important;
  }
}
</style>
