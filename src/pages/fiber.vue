<template>
  <div>
    <VBtn class="mb-3" @click="addDialog = true"> أضافة كابينة جديدة </VBtn>
    <GoogleMap
      :api-key="APIkey"
      style="width: 100%; height: calc(100vh - 125px)"
      :center="{ lat: 31.318, lng: 45.2806 }"
      :zoom="14"
      @click="getGeoPoint"
    >
      <Marker
        v-for="(m, index) in data"
        :key="index"
        :options="{
          position: { lat: m.location.lat, lng: m.location.lon },
          icon: {
            url: 'src/assets/rss-box.svg',
            scaledSize: { width: 33, height: 33 },
          },
          label: {
            text: `${m.name}`,
            color: 'red',
          },
        }"
        @click="fiberIconActions(m)"
      />
    </GoogleMap>
    <VDialog v-model="editDialog" width="1024">
      <VCard>
        <VCardTitle class="d-flex mt-5 mr-5">
          <span v-cloak class="text-h5">تعديل الكابينة</span>
        </VCardTitle>
        <VCardText>
          <VContainer>
            <VRow>
              <VCol cols="6">
                <VTextField
                  v-model="onEditfiber.name"
                  label="اسم الكابينة"
                  required
                  :hint="fileInputHint"
                />
              </VCol>
              <!-- this is the title holder -->
              <VCol cols="6">
                <VTextField
                  v-model="onEditfiber.address"
                  label="عنوان الكابينة"
                />
              </VCol>
              <!-- this is the category holder -->
              <VCol cols="6">
                <VTextField
                  v-model="onEditfiber.zone"
                  label="النطاق"
                  required
                  :hint="fileInputHint"
                />
              </VCol>
              <!-- this is the price holder -->
              <VCol cols="6">
                <VTextField
                  v-model="onEditfiber.number"
                  label="الرقم"
                  required
                  type="number"
                />
              </VCol>
              <!-- this is the description holder -->
              <VCol cols="5">
                <VTextField
                  v-model="onEditfiber.lon"
                  label="خطوط الطول"
                  required
                  disabled
                />
              </VCol>
              <!-- this is the description holder -->
              <VCol cols="5">
                <VTextField
                  v-model="onEditfiber.lat"
                  label="خطوط العرض"
                  required
                  disabled
                />
              </VCol>
              <VCol
                style="
                  display: flex;
                  height: 100%;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                "
              >
                <VBtn @click="editChangeBtn"> تغيير الموقع </VBtn>
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
            <VCol cols="3" align="center">
              <VBtn
                class="bg-red pr-5 pl-5"
                color="wight-darken-1"
                variant="text"
                @click="deleteDialog = true"
              >
                حذف الكابينة
              </VBtn>
            </VCol>
            <VCol cols="6">
              <VSpacer />
            </VCol>
            <VCol cols="3" align="center">
              <VBtn
                color="blue-darken-1"
                variant="text"
                @click="editDialog = false"
              >
                ألغاء التعديل
              </VBtn>
              <VBtn
                :loading="loading"
                color="blue-darken-1"
                variant="text"
                @click="editSaveBtnActions"
              >
                تعديل
              </VBtn>
            </VCol>
          </VRow>
        </VCardActions>
        <VDialog v-model="deleteDialog" width="auto">
          <VCard>
            <VCardTitle class="text-h5"> حذف الكابينة </VCardTitle>
            <VCardText>هل فعلا ترغب بحذف هذه الكابينة</VCardText>
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
                @click="fiberDelete"
              >
                نعم
              </VBtn>
            </VCardActions>
          </VCard>
        </VDialog>
      </VCard>
    </VDialog>
    <VDialog v-model="addDialog" width="1024">
      <VCard>
        <VCardTitle class="d-flex mt-5 mr-5">
          <span v-cloak class="text-h5">أضافة كابينة جديدة</span>
        </VCardTitle>
        <VCardText>
          <VContainer>
            <VRow>
              <VCol cols="6">
                <VTextField
                  v-model="addfiber.name"
                  label="اسم الكابينة"
                  required
                  :hint="fileInputHint"
                />
              </VCol>
              <!-- this is the title holder -->
              <VCol cols="6">
                <VTextField v-model="addfiber.address" label="عنوان الكابينة" />
              </VCol>
              <!-- this is the category holder -->
              <VCol cols="6">
                <VTextField
                  v-model="addfiber.zone"
                  label="النطاق"
                  required
                  :hint="fileInputHint"
                />
              </VCol>
              <!-- this is the price holder -->
              <VCol cols="6">
                <VTextField
                  v-model="addfiber.number"
                  label="الرقم"
                  required
                  type="number"
                />
              </VCol>
              <!-- this is the description holder -->
              <VCol cols="5">
                <VTextField
                  v-model="addfiber.lon"
                  label="خطوط العرض"
                  required
                  disabled
                />
              </VCol>
              <!-- this is the description holder -->
              <VCol cols="5">
                <VTextField
                  v-model="addfiber.lat"
                  label="خطوط الطول"
                  required
                  disabled
                />
              </VCol>
              <VCol
                style="
                  display: flex;
                  height: 100%;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                "
              >
                <VBtn @click="addChangeBtn"> تغيير الموقع </VBtn>
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
            <VCol cols="9">
              <VSpacer />
            </VCol>
            <VCol cols="3" align="center">
              <VBtn
                color="blue-darken-1"
                variant="text"
                @click="addDialog = false"
              >
                ألغاء
              </VBtn>
              <VBtn
                :loading="loading"
                color="blue-darken-1"
                variant="text"
                @click="addSaveBtnActions"
              >
                أضافة
              </VBtn>
            </VCol>
          </VRow>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script>
import {
  add_fiber_service,
  edit_fiber_service,
  get_fiber_service,
  remove_fiber_service,
} from "@/services/fiber";
import { defineComponent } from "vue";
import { GoogleMap, Marker } from "vue3-google-map";

export default defineComponent({
  components: { GoogleMap, Marker },
  data() {
    return {
      whichDialog: null,
      editDialog: false,
      addDialog: false,
      deleteDialog: false,
      APIkey: "AIzaSyBwUHuz-wugw92z-ZPO93ZCJyaVLOf9VCg",
      MyLng: null,
      MyLat: null,
      data: [],
      addfiber: {
        name: null,
        address: null,
        zone: null,
        number: null,
        lon: null,
        lat: null,
      },
      onEditfiber: {
        id: null,
        name: null,
        address: null,
        zone: null,
        number: null,
        lon: null,
        lat: null,
      },
    };
  },
  created() {
    this.getData();
    this.$getLocation()
      .then((coordinates) => {
        this.MyLat = coordinates.lat;
        this.MyLng = coordinates.lng;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    getGeoPoint(e) {
      if (this.whichDialog === "edit") {
        this.onEditfiber.lon = e.latLng.lng();
        this.onEditfiber.lat = e.latLng.lat();
        this.editDialog = true;
      } else if (this.whichDialog === "add") {
        this.addfiber.lon = e.latLng.lng();
        this.addfiber.lat = e.latLng.lat();
        this.addDialog = true;
      }
    },
    async getData() {
      const response = await get_fiber_service();

      this.data = response.results.data;
    },
    fiberIconActions(m) {
      this.editDialog = true;
      this.onEditfiber.id = m["_id"];
      this.onEditfiber.name = m.name;
      this.onEditfiber.address = m.address;
      this.onEditfiber.number = m.number;
      this.onEditfiber.zone = m.zone;
      this.onEditfiber.lon = m.location.lon;
      this.onEditfiber.lat = m.location.lat;
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
        const result = await edit_fiber_service({
          id: this.onEditfiber.id,
          name: this.onEditfiber.name,
          address: this.onEditfiber.address,
          zone: this.onEditfiber.zone,
          number: this.onEditfiber.number,
          lon: this.onEditfiber.lon,
          lat: this.onEditfiber.lat,
        });

        this.getData();
        this.editDialog = false;
        Object.keys(this.onEditfiber).forEach(
          (key) => (this.onEditfiber[key] = null)
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
        const result = await add_fiber_service({
          name: this.addfiber.name,
          address: this.addfiber.address,
          zone: this.addfiber.zone,
          number: this.addfiber.number,
          lon: this.addfiber.lon,
          lat: this.addfiber.lat,
        });

        this.getData();
        this.addDialog = false;
        Object.keys(this.addfiber).forEach(
          (key) => (this.addfiber[key] = null)
        );
        this.whichDialog = null;
      } catch (error) {
        this.whichDialog = null;
      }
      this.loading = false;
    },
    async fiberDelete() {
      try {
        const result = await remove_fiber_service(this.onEditfiber.id);

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

<style lang="scss" scoped></style>
