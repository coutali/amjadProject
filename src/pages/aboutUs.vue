<template>
  <div>
    <VForm v-model="formValid">
      <VRow>
        <VCol cols="12" md="6">
          <template>
            <div class="text-center">
              <VDialog v-model="dialog" activator="parent" width="auto">
                <VCard>
                  <VCardText> {{ finalMessage }}</VCardText>
                  <VCardActions>
                    <VBtn color="primary" block @click="dialog = false">
                      تم
                    </VBtn>
                  </VCardActions>
                </VCard>
              </VDialog>
            </div>
          </template>
          <VTextField
            v-model="data.address"
            :rules="rules.idNumberRules"
            variant="solo-filled"
            label="العنوان"
            :max-width="mdAndUp ? '50%' : '100%'"
            :loading="loading"
          />
        </VCol>
        <VCol cols="12" md="6">
          <VTextField
            v-model="data.phone"
            :rules="rules.idNumberRules"
            variant="solo-filled"
            label="رقم الهاتف"
            :loading="loading"
          />
        </VCol>
        <VCol cols="12" md="6">
          <VTextField
            v-model="data.email"
            :rules="rules.idNumberRules"
            variant="solo-filled"
            label="الحساب الألكتروني"
            :loading="loading"
          />
        </VCol>
        <VCol cols="12" md="6">
          <VTextField
            v-model="data.facebook"
            :rules="rules.idNumberRules"
            variant="solo-filled"
            label="حساب فيسبوك"
            :loading="loading"
          />
        </VCol>
        <VCol cols="12" md="6">
          <VTextField
            v-model="data.instagram"
            :rules="rules.idNumberRules"
            variant="solo-filled"
            label="حساب انستقرام"
            :loading="loading"
          />
        </VCol>
        <VCol cols="12" md="6">
          <VTextField
            v-model="data.whatsapp"
            :rules="rules.idNumberRules"
            variant="solo-filled"
            label="رقم الواتساب"
            :loading="loading"
          />
        </VCol>
        <VCol cols="12" md="6">
          <VTextField
            v-model="data.telegram"
            :rules="rules.idNumberRules"
            variant="solo-filled"
            label="حساب تيليجرام"
            :loading="loading"
          />
        </VCol>
        <VCol cols="12" md="6">
          <VTextField
            v-model="data.location"
            :rules="rules.idNumberRules"
            variant="solo-filled"
            label="الموقع الحالي"
            :loading="loading"
          />
        </VCol>
        <VCol cols="12">
          <VTextarea
            v-model="data.description"
            :rules="rules.idNumberRules"
            aria-required=""
            variant="solo-filled"
            label="الوصف"
            :loading="loading"
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <VBtn
            append-icon="mdi-content-save-all-outline"
            variant="outlined"
            block
            :disabled="!formValid"
            @click="editData"
          >
            <h4 class="btn-word" :loading="loading">حفظ</h4>
          </VBtn>
        </VCol>
      </VRow>
    </VForm>
  </div>
</template>

<script>
import { edit_aboutUs_service, get_aboutUs_service } from "@/services/aboutUs";

export default {
  data() {
    return {
      formValid: false,
      rules: {
        idNumberRules: [(v) => !!v || "الحقل مطلوب"],
      },
      content_url: "",
      loading: false,
      finalMessage: "",
      dialog: false,
      data: {},
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async editData() {
      this.loading = true;

      try {
        const response = await edit_aboutUs_service({
          address: this.data.address,
          phone: this.data.phone,
          email: this.data.email,
          facebook: this.data.facebook,
          instagram: this.data.instagram,
          whatsapp: this.data.whatsapp,
          location: this.data.location,
          telegram: this.data.telegram,
          description: this.data.description,
        });

        this.finalMessage = response.message;
      } catch (error) {
        console.log(error);
      }
      this.dialog = true;
      this.getData();
    },
    async getData() {
      this.loading = true;

      const response = await get_aboutUs_service();

      this.data = response.results;
      this.content_url = response.content_url;

      this.loading = false;
    },
  },
};
</script>

<style scoped>
.btn-word {
  color: inherit;
}
</style>
