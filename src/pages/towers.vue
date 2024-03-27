<template>
  <div>
    <VBtn :disabled="!privileges.add" class="mb-3" @click="addDialog = true">
      أضافة برج جديد
    </VBtn>
    <GoogleMap
      :api-key="APIkey"
      style="width: 100%; height: calc(100vh - 125px)"
      :center="{ lat: 31.318, lng: 45.2806 }"
      :zoom="11"
      @click="getGeoPoint"
    >
      <MarkerCluster>
        <Marker
          v-for="(m, index) in data"
          :key="index"
          :options="{
            position: { lat: m.location.lat, lng: m.location.lon },
            icon: icon,
            label: m.name,
          }"
          @click="towerIconActions(m)"
        />
      </MarkerCluster>
    </GoogleMap>
    <VForm v-model="formValid">
      <VDialog v-model="editDialog" width="1024">
        <VCard>
          <VCardTitle class="d-flex mt-5 mr-5">
            <span v-if="privileges.edit" v-cloak class="text-h5"
              >تعديل البرج</span
            >
            <span v-else v-cloak class="text-h5">ليس لديك امكانية تعديل</span>
          </VCardTitle>
          <VCardText>
            <VContainer>
              <VRow>
                <VCol cols="12" sm="6">
                  <VTextField
                    v-model="onEditTower.name"
                    label="اسم البرج"
                    required
                    :hint="fileInputHint"
                    :rules="rules.idNumberRules"
                    :disabled="!privileges.edit"
                  />
                </VCol>
                <!-- this is the title holder -->
                <VCol cols="12" sm="6">
                  <VTextField
                    v-model="onEditTower.address"
                    label="عنوان البرج"
                    :rules="rules.idNumberRules"
                    :disabled="!privileges.edit"
                  />
                </VCol>
                <!-- this is the category holder -->
                <VCol cols="12" sm="6">
                  <VTextField
                    v-model="onEditTower.affiliate"
                    label="افيلايت"
                    required
                    :hint="fileInputHint"
                    :rules="rules.idNumberRules"
                    :disabled="!privileges.edit"
                  />
                </VCol>
                <!-- this is the price holder -->
                <VCol cols="12" sm="6">
                  <VTextField
                    v-model="onEditTower.sector_name"
                    label="اسم السكتر"
                    required
                    :disabled="!privileges.edit"
                  />
                </VCol>
                <!-- this is the description holder -->
                <VCol cols="12" sm="6">
                  <VTextField
                    v-model="onEditTower.phone_first"
                    label="رقم الهاتف الأول"
                    required
                    type="number"
                    :rules="rules.idNumberRules"
                    :disabled="!privileges.edit"
                  />
                </VCol>
                <!-- this is the description holder -->
                <VCol cols="12" sm="6">
                  <VTextField
                    v-model="onEditTower.phone_second"
                    label="رقم الهاتف الثاني"
                    required
                    type="number"
                    :disabled="!privileges.edit"
                  />
                </VCol>
                <!-- this is the description holder -->
                <VCol cols="12" sm="5">
                  <VTextField
                    v-model="onEditTower.lon"
                    label="خطوط الطول"
                    type="number"
                    required
                    :rules="rules.idNumberRules"
                  />
                </VCol>
                <!-- this is the description holder -->
                <VCol cols="12" sm="5">
                  <VTextField
                    v-model="onEditTower.lat"
                    label="خطوط العرض"
                    type="number"
                    required
                    :rules="rules.idNumberRules"
                  />
                </VCol>
                <VCol
                  cols="12"
                  sm="2"
                  style="
                    display: flex;
                    height: 100%;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                  "
                >
                  <VBtn :disabled="!privileges.edit" @click="editChangeBtn">
                    تغيير الموقع
                  </VBtn>
                  <p style="font-size: 12px" class="pt-2">
                    أختر الموقع على الخريطة
                  </p>
                </VCol>
                <!-- this is the description holder -->
              </VRow>
            </VContainer>
          </VCardText>
          <VCardActions>
            <VRow>
              <VCol cols="12" sm="3" align="center">
                <VBtn
                  class="bg-red pr-5 pl-5"
                  color="wight-darken-1"
                  variant="text"
                  :disabled="!privileges.delete"
                  @click="deleteDialog = true"
                >
                  حذف البرج
                </VBtn>
              </VCol>
              <VCol xl="none" sm="6">
                <VSpacer />
              </VCol>
              <VCol cols="12" sm="3" align="center">
                <VBtn
                  color="blue-darken-1"
                  variant="text"
                  :disabled="!privileges.edit"
                  @click="editDialog = false"
                >
                  ألغاء التعديل
                </VBtn>
                <VBtn
                  :loading="loading"
                  color="blue-darken-1"
                  variant="text"
                  :disabled="!formValid || !privileges.edit"
                  @click="editSaveBtnActions"
                >
                  تعديل
                </VBtn>
              </VCol>
            </VRow>
          </VCardActions>
          <VDialog v-model="deleteDialog" width="auto">
            <VCard>
              <VCardTitle class="text-h5"> حذف البرج </VCardTitle>
              <VCardText>هل فعلا ترغب بحذف هذا البرج</VCardText>
              <VCardActions>
                <VSpacer />
                <VBtn
                  color="green-darken-1"
                  variant="text"
                  @click="deleteDialog = false"
                >
                  كلا
                </VBtn>
                <VBtn
                  :loading="loading"
                  color="green-darken-1"
                  variant="text"
                  @click="towerDelete"
                >
                  نعم
                </VBtn>
              </VCardActions>
            </VCard>
          </VDialog>
        </VCard>
      </VDialog>
    </VForm>

    <VForm v-model="formValid">
      <VDialog v-model="addDialog" width="1024">
        <VCard>
          <VCardTitle class="d-flex mt-5 mr-5">
            <span v-cloak class="text-h5">أضافة برج جديد</span>
          </VCardTitle>
          <VCardText>
            <VContainer>
              <VRow>
                <VCol cols="12" sm="6">
                  <VTextField
                    v-model="addTower.name"
                    label="أسم البرج"
                    required
                    :hint="fileInputHint"
                    :rules="rules.idNumberRules"
                  />
                </VCol>
                <!-- this is the title holder -->
                <VCol cols="12" sm="6">
                  <VTextField
                    v-model="addTower.address"
                    label="عنوان البرج"
                    :rules="rules.idNumberRules"
                  />
                </VCol>
                <!-- this is the category holder -->
                <VCol cols="12" sm="6">
                  <VTextField
                    v-model="addTower.affiliate"
                    label="افيلايت"
                    required
                    :hint="fileInputHint"
                    :rules="rules.idNumberRules"
                  />
                </VCol>
                <!-- this is the price holder -->
                <VCol cols="12" sm="6">
                  <VTextField
                    v-model="addTower.sector_name"
                    label="اسم السكتر"
                    required
                  />
                </VCol>
                <!-- this is the description holder -->
                <VCol cols="12" sm="6">
                  <VTextField
                    v-model="addTower.phone_first"
                    label="رقم الهاتف الأول"
                    required
                    type="number"
                    :rules="rules.idNumberRules"
                  />
                </VCol>
                <!-- this is the description holder -->
                <VCol cols="12" sm="6">
                  <VTextField
                    v-model="addTower.phone_second"
                    label="رقم الهاتف الثاني"
                    required
                    type="number"
                  />
                </VCol>
                <!-- this is the description holder -->
                <VCol cols="12" sm="5">
                  <VTextField
                    v-model="addTower.lon"
                    label="خطوط العرض"
                    required
                    type="number"
                    :rules="rules.idNumberRules"
                  />
                </VCol>
                <!-- this is the description holder -->
                <VCol cols="12" sm="5">
                  <VTextField
                    v-model="addTower.lat"
                    label="خطوط الطول"
                    required
                    type="number"
                    :rules="rules.idNumberRules"
                  />
                </VCol>
                <VCol
                  cols="12"
                  sm="2"
                  style="
                    display: flex;
                    height: 100%;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                  "
                >
                  <VBtn @click="addChangeBtn"> أختر الموقع </VBtn>
                  <p style="font-size: 12px" class="pt-2">
                    أختر الموقع على الخريطة
                  </p>
                </VCol>
                <!-- this is the description holder -->
              </VRow>
            </VContainer>
          </VCardText>
          <VCardActions>
            <VRow>
              <VCol xl="none" cols="9">
                <VSpacer />
              </VCol>
              <VCol cols="12" sm="3" align="center">
                <VBtn color="blue-darken-1" variant="text" @click="undo">
                  ألغاء
                </VBtn>
                <VBtn
                  :loading="loading"
                  color="blue-darken-1"
                  variant="text"
                  :disabled="!formValid"
                  @click="addSaveBtnActions"
                >
                  أضافة
                </VBtn>
              </VCol>
            </VRow>
          </VCardActions>
        </VCard>
      </VDialog>
    </VForm>
  </div>
</template>

<script>
import {
  add_towers_service,
  edit_towers_service,
  get_towers_service,
  remove_towers_service,
} from "@/services/towers";
import { defineComponent } from "vue";
import { GoogleMap, Marker, MarkerCluster } from "vue3-google-map";

export default defineComponent({
  components: { GoogleMap, Marker, MarkerCluster },
  data() {
    return {
      privileges: {
        add: false,
        edit: false,
        delete: false,
      },
      formValid: false,
      rules: {
        idNumberRules: [(v) => (!!v && v.value !== null) || "الحقل مطلوب"],
      },
      whichDialog: null,
      editDialog: false,
      addDialog: false,
      deleteDialog: false,
      APIkey: "AIzaSyBwUHuz-wugw92z-ZPO93ZCJyaVLOf9VCg",
      MyLng: null,
      MyLat: null,
      data: [],
      icon: {
        path: "M62.6 2.3C46.2-4.3 27.6 3.6 20.9 20C7.4 53.4 0 89.9 0 128s7.4 74.6 20.9 108c6.6 16.4 25.3 24.3 41.7 17.7S86.9 228.4 80.3 212C69.8 186.1 64 157.8 64 128s5.8-58.1 16.3-84C86.9 27.6 79 9 62.6 2.3zm450.8 0C497 9 489.1 27.6 495.7 44C506.2 69.9 512 98.2 512 128s-5.8 58.1-16.3 84c-6.6 16.4 1.3 35 17.7 41.7s35-1.3 41.7-17.7c13.5-33.4 20.9-69.9 20.9-108s-7.4-74.6-20.9-108C548.4 3.6 529.8-4.3 513.4 2.3zM340.1 165.2c7.5-10.5 11.9-23.3 11.9-37.2c0-35.3-28.7-64-64-64s-64 28.7-64 64c0 13.9 4.4 26.7 11.9 37.2L98.9 466.8c-7.3 16.1-.2 35.1 15.9 42.4s35.1 .2 42.4-15.9L177.7 448H398.3l20.6 45.2c7.3 16.1 26.3 23.2 42.4 15.9s23.2-26.3 15.9-42.4L340.1 165.2zM369.2 384H206.8l14.5-32H354.7l14.5 32zM288 205.3L325.6 288H250.4L288 205.3zM163.3 73.6c5.3-12.1-.2-26.3-12.4-31.6s-26.3 .2-31.6 12.4C109.5 77 104 101.9 104 128s5.5 51 15.3 73.6c5.3 12.1 19.5 17.7 31.6 12.4s17.7-19.5 12.4-31.6C156 165.8 152 147.4 152 128s4-37.8 11.3-54.4zM456.7 54.4c-5.3-12.1-19.5-17.7-31.6-12.4s-17.7 19.5-12.4 31.6C420 90.2 424 108.6 424 128s-4 37.8-11.3 54.4c-5.3 12.1 .2 26.3 12.4 31.6s26.3-.2 31.6-12.4C466.5 179 472 154.1 472 128s-5.5-51-15.3-73.6z",
        fillColor: "#9d1ae5",
        fillOpacity: 1,
        strokeWeight: 0,
        scale: 0.059,
        className: "marker",
      },
      addTower: {
        name: null,
        address: null,
        affiliate: null,
        sector_name: null,
        phone_first: null,
        phone_second: null,
        lon: null,
        lat: null,
      },
      onEditTower: {
        id: null,
        name: null,
        address: null,
        affiliate: null,
        sector_name: null,
        phone_first: null,
        phone_second: null,
        lon: null,
        lat: null,
      },
    };
  },

  created() {
    this.getData();
  },
  methods: {
    getGeoPoint(e) {
      if (this.whichDialog === "edit") {
        this.onEditTower.lon = e.latLng.lng();
        this.onEditTower.lat = e.latLng.lat();
        this.editDialog = true;
      } else if (this.whichDialog === "add") {
        this.addTower.lon = e.latLng.lng();
        this.addTower.lat = e.latLng.lat();
        this.addDialog = true;
      }
    },
    undo() {
      this.addDialog = false;
      Object.keys(this.addTower).forEach((key) => (this.addTower[key] = null));
      this.whichDialog = null;
    },
    async getData() {
      const response = await get_towers_service();

      this.data = response.results.data;
      JSON.parse(localStorage.getItem("results")).privileges.actions.map(
        (e) => (this.privileges[e] = true)
      );
    },
    towerIconActions(m) {
      this.editDialog = true;
      this.onEditTower.id = m["_id"];
      this.onEditTower.name = m.name;
      this.onEditTower.address = m.address;
      this.onEditTower.affiliate = m.affiliate;
      this.onEditTower.sector_name = m.sector_name;
      this.onEditTower.phone_first = m.phone_first;
      this.onEditTower.phone_second = m.phone_second;
      this.onEditTower.lon = m.location.lon;
      this.onEditTower.lat = m.location.lat;
    },
    editChangeBtn() {
      this.editDialog = false;
      this.whichDialog = "edit";
    },
    addChangeBtn() {
      this.addDialog = false;
      this.whichDialog = "add";
    },
    async editSaveBtnActions() {
      this.loading = true;
      try {
        const result = await edit_towers_service({
          id: this.onEditTower.id,
          name: this.onEditTower.name,
          address: this.onEditTower.address,
          affiliate: this.onEditTower.affiliate,
          sector_name: this.onEditTower.sector_name,
          phone_first: this.onEditTower.phone_first,
          phone_second: this.onEditTower.phone_second,
          lon: this.onEditTower.lon,
          lat: this.onEditTower.lat,
        });

        this.getData();
        this.editDialog = false;
        Object.keys(this.onEditTower).forEach(
          (key) => (this.onEditTower[key] = null)
        );
        this.whichDialog = null;
      } catch (error) {
        this.whichDialog = null;
      }
      this.loading = false;
    },
    async addSaveBtnActions() {
      this.loading = true;
      try {
        const result = await add_towers_service({
          name: this.addTower.name,
          address: this.addTower.address,
          affiliate: this.addTower.affiliate,
          sector_name: this.addTower.sector_name,
          phone_first: this.addTower.phone_first,
          phone_second: this.addTower.phone_second,
          lon: this.addTower.lon,
          lat: this.addTower.lat,
        });

        this.getData();
        this.addDialog = false;
        Object.keys(this.addTower).forEach(
          (key) => (this.addTower[key] = null)
        );
        this.whichDialog = null;
      } catch (error) {
        this.whichDialog = null;
      }
      this.loading = false;
    },
    async towerDelete() {
      try {
        const result = await remove_towers_service(this.onEditTower.id);

        this.deleteDialog = false;
        this.editDialog = false;
        this.getData();
      } catch (error) {
        this.finalMessage = result.message;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.marker {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: red;
  block-size: 100px;
  color: white;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  inline-size: 100px;
  inset-block-start: 50%;
  inset-inline-start: 50%;
  text-align: center;
  transform: translate(-50%, -50%);
  transition: all 0.3s;

  &:hover {
    transform: translate(-50%, -50%) scale(1.2);
  }
}
</style>
