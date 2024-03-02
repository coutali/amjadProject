<template>
  <div>
    <VBtn class="mb-3" @click="addDialog = true"> أضافة مكتب جديد </VBtn>
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
            url: 'src/assets/office-building-marker-outline.svg',
            scaledSize: { width: 33, height: 33 },
          },
          label: {
            text: `${m.name}`,
            color: 'red',
          },
        }"
        @click="officesIconActions(m)"
      />
    </GoogleMap>
    <VDialog v-model="editDialog" width="1024">
      <VCard>
        <VCardTitle class="d-flex mt-5 mr-5">
          <span v-cloak class="text-h5">تعديل المكتب</span>
        </VCardTitle>
        <VCardText>
          <VContainer>
            <VRow>
              <VCol cols="6">
                <VTextField
                  v-model="onEditoffices.name"
                  label="اسم المكتب"
                  required
                  :hint="fileInputHint"
                />
              </VCol>
              <!-- this is the title holder -->
              <VCol cols="6">
                <VTextField
                  v-model="onEditoffices.address"
                  label="عنوان المكتب"
                />
              </VCol>
              <!-- this is the category holder -->
              <VCol cols="5">
                <VTextField
                  v-model="onEditoffices.lon"
                  label="خطوط الطول"
                  required
                  disabled
                />
              </VCol>
              <!-- this is the description holder -->
              <VCol cols="5">
                <VTextField
                  v-model="onEditoffices.lat"
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
                حذف المكتب
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
            <VCardTitle class="text-h5"> حذف المكتب </VCardTitle>
            <VCardText>هل فعلا ترغب بحذف هذا المكتب</VCardText>
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
                @click="officesDelete"
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
          <span v-cloak class="text-h5">أضافة مكتب جديد</span>
        </VCardTitle>
        <VCardText>
          <VContainer>
            <VRow>
              <VCol cols="6">
                <VTextField
                  v-model="addoffices.name"
                  label="اسم المكتب"
                  required
                  :hint="fileInputHint"
                />
              </VCol>
              <!-- this is the title holder -->
              <VCol cols="6">
                <VTextField v-model="addoffices.address" label="عنوان المكتب" />
              </VCol>
              <!-- this is the category holder -->
              <VCol cols="5">
                <VTextField
                  v-model="addoffices.lon"
                  label="خطوط العرض"
                  required
                  disabled
                />
              </VCol>
              <!-- this is the description holder -->
              <VCol cols="5">
                <VTextField
                  v-model="addoffices.lat"
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
  add_offices_service,
  edit_offices_service,
  get_offices_service,
  remove_offices_service,
} from "@/services/offices";
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
      addoffices: {
        name: null,
        address: null,
        lon: null,
        lat: null,
      },
      onEditoffices: {
        id: null,
        name: null,
        address: null,
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
      .catch((error) => {});
  },
  methods: {
    getGeoPoint(e) {
      if (this.whichDialog === "edit") {
        this.onEditoffices.lon = e.latLng.lng();
        this.onEditoffices.lat = e.latLng.lat();
        this.editDialog = true;
      } else if (this.whichDialog === "add") {
        this.addoffices.lon = e.latLng.lng();
        this.addoffices.lat = e.latLng.lat();
        this.addDialog = true;
      }
    },
    async getData() {
      const response = await get_offices_service();

      this.data = response.results.data;
    },
    officesIconActions(m) {
      this.editDialog = true;
      this.onEditoffices.id = m["_id"];
      this.onEditoffices.name = m.name;
      this.onEditoffices.address = m.address;
      this.onEditoffices.lon = m.location.lon;
      this.onEditoffices.lat = m.location.lat;
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
        const result = await edit_offices_service({
          id: this.onEditoffices.id,
          name: this.onEditoffices.name,
          address: this.onEditoffices.address,
          zone: this.onEditoffices.zone,
          number: this.onEditoffices.number,
          lon: this.onEditoffices.lon,
          lat: this.onEditoffices.lat,
        });

        this.getData();
        this.editDialog = false;
        Object.keys(this.onEditoffices).forEach(
          (key) => (this.onEditoffices[key] = null)
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
        const result = await add_offices_service({
          name: this.addoffices.name,
          address: this.addoffices.address,
          zone: this.addoffices.zone,
          number: this.addoffices.number,
          lon: this.addoffices.lon,
          lat: this.addoffices.lat,
        });

        this.getData();
        this.addDialog = false;
        Object.keys(this.addoffices).forEach(
          (key) => (this.addoffices[key] = null)
        );
        this.whichDialog = null;
      } catch (error) {
        this.whichDialog = null;
      }
      this.loading = false;
    },
    async officesDelete() {
      try {
        const result = await remove_offices_service(this.onEditoffices.id);

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
