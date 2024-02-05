<script setup>
import FlatPickr from 'vue-flatpickr-component'
import { useTheme } from 'vuetify'
import {
  VField,
  filterFieldProps,
  makeVFieldProps,
} from 'vuetify/lib/components/VField/VField'
import {
  VInput,
  makeVInputProps,
} from 'vuetify/lib/components/VInput/VInput'

import { filterInputAttrs } from 'vuetify/lib/util/helpers'
import { useThemeConfig } from '@core/composable/useThemeConfig'

const props = defineProps({
  autofocus: Boolean,
  counter: [
    Boolean,
    Number,
    String,
  ],
  counterValue: Function,
  prefix: String,
  placeholder: String,
  persistentPlaceholder: Boolean,
  persistentCounter: Boolean,
  suffix: String,
  type: {
    type: String,
    default: 'text',
  },
  modelModifiers: Object,
  ...makeVInputProps({ hideDetails: 'auto' }),
  ...makeVFieldProps({
    variant: 'outlined',
    color: 'primary',
  }),
})

const emit = defineEmits([
  'click:control',
  'mousedown:control',
  'update:focused',
  'update:modelValue',
  'click:clear',
])

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const [rootAttrs, compAttrs] = filterInputAttrs(attrs)

const [{
  modelValue: _,
  ...inputProps
}] = VInput.filterProps(props)

const [fieldProps] = filterFieldProps(props)
const refFlatPicker = ref()
const { focused } = useFocus(refFlatPicker)
const isCalendarOpen = ref(false)
const isInlinePicker = ref(false)

// flat picker prop manipulation
if (compAttrs.config && compAttrs.config.inline) {
  isInlinePicker.value = compAttrs.config.inline
  Object.assign(compAttrs, { altInputClass: 'inlinePicker' })
}

const onClear = el => {
  el.stopPropagation()
  nextTick(() => {
    emit('update:modelValue', '')
    emit('click:clear', el)
  })
}

const { theme } = useThemeConfig()
const vuetifyTheme = useTheme()
const vuetifyThemesName = Object.keys(vuetifyTheme.themes.value)

// Themes class added to flat-picker component for light and dark support
const updateThemeClassInCalendar = () => {

  // ℹ️ Flatpickr don't render it's instance in mobile and device simulator
  if (!refFlatPicker.value.fp.calendarContainer)
    return
  vuetifyThemesName.forEach(t => {
    refFlatPicker.value.fp.calendarContainer.classList.remove(`v-theme--${ t }`)
  })
  refFlatPicker.value.fp.calendarContainer.classList.add(`v-theme--${ vuetifyTheme.global.name.value }`)
}

watch(theme, updateThemeClassInCalendar)
onMounted(() => {
  updateThemeClassInCalendar()
})

const emitModelValue = val => {
  emit('update:modelValue', val)
}
</script>

<template>
  <div class="app-picker-field">
    <VInput
      v-bind="{ ...inputProps, ...rootAttrs }"
      :model-value="modelValue"
      :hide-details="props.hideDetails"
      :class="[{
        'v-text-field--prefixed': props.prefix,
        'v-text-field--suffixed': props.suffix,
        'v-text-field--flush-details': ['plain', 'underlined'].includes(props.variant),
      }, props.class]"
      class="position-relative v-text-field"
      :style="props.style"
    >
      <template #default="{ id, isDirty, isValid, isDisabled }">
        <!-- v-field -->
        <VField
          v-bind="{ ...fieldProps }"
          :id="id.value"
          role="textbox"
          :active="focused || isDirty.value || isCalendarOpen"
          :focused="focused || isCalendarOpen"
          :dirty="isDirty.value || props.dirty"
          :error="isValid.value === false"
          :disabled="isDisabled.value"
          @click:clear="onClear"
        >
          <template #default="{ props: vFieldProps }">
            <div v-bind="vFieldProps">
              <!-- flat-picker  -->
              <FlatPickr
                v-if="!isInlinePicker"
                v-bind="compAttrs"
                ref="refFlatPicker"
                :model-value="modelValue"
                :placeholder="props.placeholder"
                class="flat-picker-custom-style"
                :disabled="isReadonly.value"
                @on-open="isCalendarOpen = true"
                @on-close="isCalendarOpen = false"
                @update:model-value="emitModelValue"
              />

              <!-- simple input for inline prop -->
              <input
                v-if="isInlinePicker"
                :value="modelValue"
                :placeholder="props.placeholder"
                class="flat-picker-custom-style"
                type="text"
              >
            </div>
          </template>
        </VField>
      </template>
    </VInput>

    <!-- flat picker for inline props -->
    <FlatPickr
      v-if="isInlinePicker"
      v-bind="compAttrs"
      ref="refFlatPicker"
      :model-value="modelValue"
      @update:model-value="emitModelValue"
      @on-open="isCalendarOpen = true"
      @on-close="isCalendarOpen = false"
    />
  </div>
</template>

<style lang="scss">
/* stylelint-disable no-descending-specificity */
@use "flatpickr/dist/flatpickr.css";
@use "@core/scss/base/mixins";

.flat-picker-custom-style {
  position: absolute;
  color: inherit;
  inline-size: 100%;
  inset: 0;
  outline: none;
  padding-block: 0;
  padding-inline: var(--v-field-padding-start);
}

$heading-color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
$body-color: rgba(var(--v-theme-on-background), var(--v-medium-emphasis-opacity));

// hide the input when your picker is inline
input[altinputclass="inlinePicker"] {
  display: none;
}

.flatpickr-calendar {
  background-color: rgb(var(--v-theme-surface));
  margin-block-start: 0.1875rem;

  @include mixins.elevation(6);

  .flatpickr-rContainer {
    .flatpickr-weekdays {
      padding-inline: 0.5rem;
    }

    .flatpickr-days {
      .dayContainer {
        justify-content: center !important;
        padding-block-end: 0.5rem;
        padding-block-start: 0;

        .flatpickr-day {
          block-size: 40px;
          line-height: 40px;
          margin-block-start: 0 !important;
          max-inline-size: 40px;
        }
      }
    }
  }

  .flatpickr-day {
    color: $body-color;

    &.today {
      border-color: rgb(var(--v-theme-primary));

      &:hover {
        border-color: rgb(var(--v-theme-primary));
        background: transparent;
        color: $body-color;
      }
    }

    &.selected,
    &.selected:hover {
      border-color: rgb(var(--v-theme-primary));
      background: rgb(var(--v-theme-primary));
      color: rgb(var(--v-theme-on-primary));
    }

    &.inRange,
    &.inRange:hover {
      border: none;
      background: rgba(var(--v-theme-primary), 0.1) !important;
      box-shadow: none !important;
      color: rgb(var(--v-theme-primary));
    }

    &.startRange {
      box-shadow: none;
    }

    &.endRange {
      box-shadow: none;
    }

    &.startRange,
    &.endRange,
    &.startRange:hover,
    &.endRange:hover {
      border-color: rgb(var(--v-theme-primary));
      background: rgb(var(--v-theme-primary));
      color: rgb(var(--v-theme-on-primary));
    }

    &.selected.startRange + .endRange:not(:nth-child(7n + 1)),
    &.startRange.startRange + .endRange:not(:nth-child(7n + 1)),
    &.endRange.startRange + .endRange:not(:nth-child(7n + 1)) {
      box-shadow: -10px 0 0 rgb(var(--v-theme-primary));
    }

    &.flatpickr-disabled,
    &.prevMonthDay:not(.startRange,.inRange),
    &.nextMonthDay:not(.endRange,.inRange) {
      opacity: var(--v-disabled-opacity);
    }

    &:hover {
      border-color: rgba(var(--v-theme-surface-variant), var(--v-hover-opacity));
      background: rgba(var(--v-theme-surface-variant), var(--v-hover-opacity));
    }
  }

  .flatpickr-weekday {
    color: $heading-color;
    font-size: 14px;
    font-weight: 500;
  }

  &::after,
  &::before {
    display: none;
  }

  .flatpickr-months {
    padding-block-start: 0.5rem;

    .flatpickr-prev-month,
    .flatpickr-next-month {
      fill: rgba(var(--v-theme-on-surface), 0.54);

      svg {
        stroke: rgba(var(--v-theme-on-surface), 0.54);
        stroke-width: 2px;
      }

      &:hover i,
      &:hover svg {
        fill: $body-color;
      }
    }
  }

  .flatpickr-current-month span.cur-month {
    font-weight: 400;
  }

  &.open {
    // Open calendar above overlay
    z-index: 2401;
  }

  &.hasTime.open {
    .flatpickr-time {
      border-color: rgba(var(--v-border-color), var(--v-border-opacity));
      block-size: auto;
    }
  }
}

// Time picker hover & focus bg color
.flatpickr-time input:hover,
.flatpickr-time .flatpickr-am-pm:hover,
.flatpickr-time input:focus,
.flatpickr-time .flatpickr-am-pm:focus {
  background: transparent;
}

// Time picker
.flatpickr-time {
  input.flatpickr-hour {
    font-weight: 400;
  }

  .flatpickr-am-pm,
  .flatpickr-time-separator,
  input {
    color: $heading-color;
  }

  .numInputWrapper {
    span {
      &.arrowUp {
        &::after {
          border-block-end-color: rgb(var(--v-border-color));
        }
      }

      &.arrowDown {
        &::after {
          border-block-start-color: rgb(var(--v-border-color));
        }
      }
    }
  }
}

//  Added bg color for flatpickr input only as it has default readonly attribute
.flatpickr-input[readonly],
.flatpickr-input ~ .form-control[readonly],
.flatpickr-human-friendly[readonly] {
  background-color: inherit;
  opacity: 1 !important;
}

// week sections
.flatpickr-weekdays {
  margin-block: 8px;
}

// Month and year section
.flatpickr-current-month {
  .flatpickr-monthDropdown-months {
    appearance: none;
    block-size: 24px;
  }

  .flatpickr-monthDropdown-months,
  .numInputWrapper {
    padding: 2px;
    border-radius: 4px;
    color: $heading-color;
    font-size: 1rem;
    font-weight: 400;
    transition: all 0.15s ease-out;

    span {
      display: none;
    }

    input.cur-year {
      font-weight: 400 !important;
    }

    .flatpickr-monthDropdown-month {
      background-color: rgb(var(--v-theme-surface));
    }
  }
}

.flatpickr-day.flatpickr-disabled,
.flatpickr-day.flatpickr-disabled:hover {
  color: $body-color;
}

// removing box shadow of calendar in dark and added a border
.v-theme--dark.flatpickr-calendar {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  box-shadow: none;
}

.flatpickr-months {
  padding-block: 0.3rem;
  padding-inline: 0;

  .flatpickr-prev-month,
  .flatpickr-next-month {
    inset-block-start: 0.5rem !important;
  }

  .flatpickr-next-month {
    inset-inline-end: 0.375rem !important;
  }

  .flatpickr-prev-month {
    inset-inline-start: 0.25rem !important;
  }
}
</style>
