<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-text-field
        variant="solo-filled"
        label="العنوان"
        v-model="data.address"
        :max-width="mdAndUp ? '50%' : '100%'"
      ></v-text-field>
    </v-col>
    <v-col cols="12" md="6">
      <v-text-field
        variant="solo-filled"
        label="رقم الهاتف"
        v-model="data.phone"
      ></v-text-field>
    </v-col>
    <v-col cols="12" md="6">
      <v-text-field
        variant="solo-filled"
        label="الحساب الألكتروني"
        v-model="data.email"
      ></v-text-field>
    </v-col>
    <v-col cols="12" md="6">
      <v-text-field
        variant="solo-filled"
        label="حساب فيسبوك"
        v-model="data.facebook"
      ></v-text-field>
    </v-col>
    <v-col cols="12" md="6">
      <v-text-field
        variant="solo-filled"
        label="حساب انستقرام"
        v-model="data.instagram"
      ></v-text-field>
    </v-col>
    <v-col cols="12" md="6">
      <v-text-field
        variant="solo-filled"
        label="رقم الواتساب"
        v-model="data.whatsapp"
      ></v-text-field>
    </v-col>
    <v-col cols="12" md="6">
      <v-text-field
        variant="solo-filled"
        label="حساب تيليجرام"
        v-model="data.telegram"
      ></v-text-field>
    </v-col>
    <v-col cols="12" md="6">
      <v-text-field
        variant="solo-filled"
        label="الموقع الحالي"
        v-model="data.location"
      ></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-textarea
        variant="solo-filled"
        label="الوصف"
        v-model="data.description"
      ></v-textarea>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <v-btn
        append-icon="mdi-content-save-all-outline"
        variant="outlined"
        block
      >
        <h4 class="btn-word">حفظ</h4>
      </v-btn>
    </v-col>
  </v-row>
</template>
<script>
export default {
  data() {
    return {
      data: {
        _id: "65bfce9aee959222c7210c0f",
        address: null,
        phone: null,
        email: null,
        facebook: null,
        instagram: null,
        whatsapp: null,
        location: null,
        telegram: null,
        description: null,
      },
    };
  },
};
</script>

<style scoped>
.btn-word {
  color: inherit;
}
</style>
