<script setup>
const props = defineProps({
  billingAddress: {
    type: Object,
    required: false,
    default: () => ({
      companyName: '',
      billingEmail: '',
      taxID: '',
      vatNumber: '',
      address: '',
      contact: '',
      country: null,
      state: '',
      zipCode: null,
    }),
  },
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDialogVisible',
  'submit',
])

const billingAddress = ref(structuredClone(toRaw(props.billingAddress)))

const resetForm = () => {
  emit('update:isDialogVisible', false)
  billingAddress.value = structuredClone(toRaw(props.billingAddress))
}

const onFormSubmit = () => {
  emit('update:isDialogVisible', false)
  emit('submit', billingAddress.value)
}

const selectedAddress = ref('Home')

const addressTypes = [
  {
    icon: 'mdi-home-outline',
    title: 'Home',
    time: 'Delivery Time (7am - 9pm)',
  },
  {
    icon: 'mdi-briefcase-outline',
    title: 'Office',
    time: 'Delivery Time (10am - 6pm)',
  },
]
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 900 "
    :model-value="props.isDialogVisible"
    @update:model-value="val => $emit('update:isDialogVisible', val)"
  >
    <VCard
      v-if="props.billingAddress"
      class="pa-sm-8 pa-5"
    >
      <!-- 👉 dialog close btn -->
      <DialogCloseBtn
        variant="text"
        size="small"
        @click="resetForm"
      />

      <!-- 👉 Title -->
      <VCardItem>
        <VCardTitle class="text-h5 text-center">
          {{ props.billingAddress.address ? 'Edit' : 'Add New' }} Address
        </VCardTitle>
      </VCardItem>

      <VCardText>
        <!-- 👉 Subtitle -->
        <VCardSubtitle class="text-center mb-9">
          Edit Address for future billing
        </VCardSubtitle>

        <VRow>
          <VCol
            v-for="type in addressTypes"
            :key="type.title"
            cols="12"
            sm="6"
          >
            <div
              class="rounded border cursor-pointer border-opacity-100 pa-4"
              :class="selectedAddress === type.title ? 'bg-light-primary text-primary border-primary' : 'bg-var-theme-background text-high-emphasis border-secondary'"
              @click="selectedAddress = type.title"
            >
              <div class="d-flex align-center font-weight-medium gap-2 text-xl mb-1">
                <VIcon
                  size="24"
                  :icon="type.icon"
                />
                <span>{{ type.title }}</span>
              </div>
              <span>{{ type.time }}</span>
            </div>
          </VCol>
        </VRow>

        <!-- 👉 Form -->
        <VForm
          class="mt-4"
          @submit.prevent="onFormSubmit"
        >
          <VRow>
            <!-- 👉 Company Name -->
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="billingAddress.companyName"
                label="Company Name"
              />
            </VCol>

            <!-- 👉 Email -->
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="billingAddress.billingEmail"
                label="Email"
              />
            </VCol>

            <!-- 👉 Tax ID -->
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="billingAddress.taxID"
                label="Tax ID"
              />
            </VCol>

            <!-- 👉 VAT Number -->
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="billingAddress.vatNumber"
                label="VAT Number"
              />
            </VCol>

            <!-- 👉 Billing Address -->
            <VCol cols="12">
              <VTextarea
                v-model="billingAddress.address"
                rows="2"
                label="Billing Address"
              />
            </VCol>

            <!-- 👉 Contact -->
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="billingAddress.contact"
                label="Contact"
              />
            </VCol>

            <!-- 👉 Country -->
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="billingAddress.country"
                label="Country"
              />
            </VCol>

            <!-- 👉 State -->
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="billingAddress.state"
                label="State"
              />
            </VCol>

            <!-- 👉 Zip Code -->
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="billingAddress.zipCode"
                label="Zip Code"
                type="number"
              />
            </VCol>

            <!-- 👉 Submit and Cancel button -->
            <VCol
              cols="12"
              class="d-flex flex-wrap gap-4 gap-y-6 flex-column"
            >
              <div>
                <VSwitch label="Make this default shipping address" />
              </div>

              <div class="d-flex justify-center gap-4">
                <VBtn type="submit">
                  submit
                </VBtn>

                <VBtn
                  variant="tonal"
                  color="secondary"
                  @click="resetForm"
                >
                  Cancel
                </VBtn>
              </div>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
