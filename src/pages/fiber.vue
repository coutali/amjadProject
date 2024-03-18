<template>
  <div>
    <VBtn class="mb-3" @click="addDialog = true"> أضافة كابينة جديدة </VBtn>
    <GoogleMap
      ref="map"
      :api-key="APIkey"
      style="width: 100%; height: calc(100vh - 125px)"
      :center="{ lat: 31.318, lng: 45.2806 }"
      :zoom="15"
      :map-type-control="false"
      :clickable-icons="false"
      @click="getGeoPoint"
    >
      <Polygon
        v-for="(p, i) in data"
        :key="i"
        :options="{
          ...options,
          paths: paths(p.zone),
          editable: false,
          clickable: false,
        }"
      />

      <Marker
        v-for="(m, index) in data"
        :key="index"
        :options="{
          position: { lat: m.location.lat, lng: m.location.lon },
          icon: icon,
          label: m.name,
        }"
        @click="fiberIconActions(m)"
      />
    </GoogleMap>
    <VForm v-model="formValid">
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
                    :rules="rules.idNumberRules"
                  />
                </VCol>
                <!-- this is the category holder -->
                <VCol cols="5">
                  <VTextField
                    v-model="onEditfiber.lon"
                    label="خطوط الطول"
                    required
                    disabled
                    :rules="rules.idNumberRules"
                  />
                </VCol>
                <!-- this is the description holder -->
                <VCol cols="5">
                  <VTextField
                    v-model="onEditfiber.lat"
                    label="خطوط العرض"
                    required
                    disabled
                    :rules="rules.idNumberRules"
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
                <VCol
                  cols="12"
                  style="
                    display: flex;
                    height: 120%;
                    align-items: center;
                    justify-content: center;
                  "
                >
                  <VBtn
                    prepend-icon="mdi-cog"
                    style="width: 90%; font-weight: 700"
                    @click="zoneEditDialog = true"
                  >
                    تعديل الزون والأعمدة
                  </VBtn>
                </VCol>
                <!-- this is the price holder -->
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
                  :disabled="!formValid"
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
    </VForm>

    <VForm v-model="formValid">
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
                    :rules="rules.idNumberRules"
                  />
                </VCol>
                <!-- this is the title holder -->
                <VCol cols="6">
                  <VTextField
                    v-model="addfiber.address"
                    label="عنوان الكابينة"
                    :rules="rules.idNumberRules"
                  />
                </VCol>
                <!-- this is the category holder -->
                <VCol cols="5">
                  <VTextField
                    v-model="addfiber.lon"
                    label="خطوط العرض"
                    required
                    disabled
                    :rules="rules.idNumberRules"
                  />
                </VCol>
                <!-- this is the description holder -->
                <VCol cols="5">
                  <VTextField
                    v-model="addfiber.lat"
                    label="خطوط الطول"
                    required
                    disabled
                    :rules="rules.idNumberRules"
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
                <VCol
                  cols="12"
                  style="
                    display: flex;
                    height: 120%;
                    align-items: center;
                    justify-content: center;
                  "
                >
                  <VBtn
                    prepend-icon="mdi-cog"
                    style="width: 90%; font-weight: 700"
                    @click="addZoneDialogRules"
                  >
                    تعديل الزون والأعمدة
                  </VBtn>
                </VCol>
                <!-- this is the price holder -->
              </VRow>
            </VContainer>
          </VCardText>
          <VCardActions>
            <VRow>
              <VCol cols="9">
                <VSpacer />
              </VCol>
              <VCol cols="3" align="center">
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
    <VDialog v-model="locationFirstDialog" width="auto">
      <VCard
        max-width="400"
        prepend-icon="mdi-map-marker-plus"
        text="يرجى تحديد موقع الكابينة ليتسنى لك تحديد الزون و الاعمدة"
        title="حدد موقع الكابينة"
      >
        <VBtn
          variant="text"
          class="ms-auto"
          text="Ok"
          @click="locationFirstDialog = false"
        />
      </VCard>
    </VDialog>
    <!-- this is the pillar dialog -->
    <VForm v-model="formValid">
      <VDialog v-model="addPillarDialog" width="512">
        <VCard>
          <VCardTitle class="d-flex mt-5 mr-5">
            <span v-cloak class="text-h5"> العمود</span>
          </VCardTitle>
          <VCardText>
            <VContainer>
              <VRow>
                <VCol cols="12">
                  <VTextField
                    v-model="pillarIndexing"
                    label="رقم العمود"
                    required
                    type="number"
                    max="48"
                    min="1"
                    :hint="fileInputHint"
                    :rules="rules.idNumberRules"
                  />
                </VCol>
              </VRow>
            </VContainer>
          </VCardText>
          <VCardActions>
            <VRow>
              <VCol cols="12" align="left">
                <VBtn
                  color="blue-darken-1"
                  variant="text"
                  @click="addPillarDialog = false"
                >
                  ألغاء
                </VBtn>
                <VBtn
                  :loading="loading"
                  color="blue-darken-1"
                  variant="text"
                  :disabled="!formValid"
                  @click="addPillar"
                >
                  اضافة
                </VBtn>
              </VCol>
            </VRow>
          </VCardActions>
        </VCard>
      </VDialog>
    </VForm>
    <!-- this is the zone add dialog -->
    <VDialog
      v-model="zoneAddDialog"
      transition="dialog-bottom-transition"
      fullscreen
    >
      <VCard>
        <VCardTitle class="d-flex mt-5 mr-5">
          <VRow>
            <VCol cols="10">
              <span v-cloak class="text-h5">تعديل الزون والأعمدة</span>
            </VCol>
            <VCol cols="2" align="right" style="display: flex; gap: 10px">
              <VBtn @click="getZone"> ألغاء </VBtn>
              <VBtn @click="getZone"> حفظ </VBtn>
            </VCol>
          </VRow>
        </VCardTitle>
        <VCardText>
          <VContainer>
            <!-- this is the zone map -->
            <GoogleMap
              ref="map"
              :api-key="APIkey"
              style="width: 100%; height: calc(100vh - 125px)"
              :center="{ lat: addfiber.lat, lng: addfiber.lon }"
              :zoom="15"
              :map-type-control="false"
              :clickable-icons="false"
              @click="getPillerGeoPoint"
            >
              <!-- this is the other capiens zone -->
              <Polygon
                v-for="(p, i) in data"
                :key="i"
                :options="{
                  ...options,
                  paths: paths(p.zone),
                  editable: false,
                  clickable: false,
                  fillColor: '#000000',
                  strokeColor: '#000000',
                }"
              />
              <!-- this is the zone of the current capien -->
              <Polygon
                ref="currentShape"
                :options="{
                  ...options,
                  paths: addfiber.zonePoints,
                  editable: true,
                  clickable: false,
                }"
              />
              <!-- this is the new capine -->
              <Marker
                :options="{
                  position: { lat: addfiber.lat, lng: addfiber.lon },
                  icon: icon,
                  label: addfiber.name || 'الكابينة الجديدة',
                }"
              />
              <!-- this is the other capines -->
              <Marker
                v-for="(m, index) in data"
                :key="index"
                :options="{
                  position: { lat: m.location.lat, lng: m.location.lon },
                  icon: {
                    path: icon.path,
                    fillColor: '#000000',
                    fillOpacity: 0.5,
                    strokeWeight: 0,
                  },
                  label: m.name,
                }"
              />

              <Marker
                v-for="(m, index) in addfiber.pillars"
                :key="index"
                :options="{
                  position: { lat: m.location.lat, lng: m.location.lon },
                  icon: {
                    path: icon.path,
                    fillColor: '#000000',
                    fillOpacity: 0.5,
                    strokeWeight: 0,
                  },
                }"
              />
            </GoogleMap>
          </VContainer>
        </VCardText>
      </VCard>
    </VDialog>
    <!-- this is the zone edit dialog -->
    <VDialog
      v-model="zoneEditDialog"
      transition="dialog-bottom-transition"
      fullscreen
    >
      <VCard>
        <VCardTitle class="d-flex mt-5 mr-5">
          <VRow>
            <VCol cols="10">
              <span v-cloak class="text-h5">تعديل الزون والأعمدة</span>
            </VCol>
            <VCol cols="2" align="right" style="display: flex; gap: 10px">
              <VBtn @click="editGetZone"> ألغاء </VBtn>
              <VBtn @click="editGetZone"> حفظ </VBtn>
            </VCol>
          </VRow>
        </VCardTitle>
        <VCardText>
          <VContainer>
            <!-- this is the zone map -->
            <GoogleMap
              ref="map"
              :api-key="APIkey"
              style="width: 100%; height: calc(100vh - 125px)"
              :center="{ lat: onEditfiber.lat, lng: onEditfiber.lon }"
              :zoom="15"
              :map-type-control="false"
              :clickable-icons="false"
              @click="getPillerGeoPoint"
            >
              <!-- this is the other capiens zone -->
              <div v-for="(p, i) in data" :key="i">
                <Polygon
                  v-if="p['_id'] !== onEditfiber.id"
                  :options="{
                    ...options,
                    paths: paths(p.zone),
                    editable: false,
                    clickable: false,
                    fillColor: '#000000',
                    strokeColor: '#000000',
                  }"
                />
                <Polygon
                  v-else
                  ref="lastShape"
                  :options="{
                    ...options,
                    paths: paths(p.zone),
                    editable: true,
                    clickable: false,
                  }"
                />
              </div>
              <!-- this is the on edit capine -->
              <div v-for="(p, i) in data" :key="i">
                <Marker
                  v-if="p['_id'] !== onEditfiber.id"
                  :options="{
                    position: { lat: p.location.lat, lng: p.location.lon },
                    icon: {
                      path: icon.path,
                      fillColor: '#000000',
                      fillOpacity: 0.5,
                      strokeWeight: 0,
                    },
                    label: p.name,
                  }"
                />
                <Marker
                  v-else
                  :options="{
                    position: { lat: p.location.lat, lng: p.location.lon },
                    icon: icon,
                    label: p.name,
                  }"
                  @click="fiberIconActions(m)"
                />
              </div>

              <Marker
                v-for="(m, index) in addfiber.pillars"
                :key="index"
                :options="{
                  position: { lat: m.location.lat, lng: m.location.lon },
                  icon: {
                    path: icon.path,
                    fillColor: '#000000',
                    fillOpacity: 0.5,
                    strokeWeight: 0,
                  },
                }"
              />
            </GoogleMap>
          </VContainer>
        </VCardText>
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
import { GoogleMap, Marker, Polygon } from "vue3-google-map";

export default defineComponent({
  components: { GoogleMap, Marker, Polygon },
  data() {
    return {
      options: {
        paths: [],
        strokeColor: "#9d1ae5",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#9d1ae5",
        fillOpacity: 0.35,
        editable: true,
      },
      formValid: false,
      rules: {
        idNumberRules: [(v) => !!v || "الحقل مطلوب"],
      },
      pillarIndexing: null,
      pillarCurrentLocation: null,
      addPillarDialog: false,
      locationFirstDialog: false,
      whichDialog: null,
      zoneAddDialog: false,
      zoneEditDialog: false,
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
        number: null,
        lon: null,
        lat: null,
        zonePoints: [],
        pillars: [],
      },
      onEditfiber: {
        id: null,
        name: null,
        address: null,
        number: null,
        lon: null,
        lat: null,
        zonePoints: [],
        pillars: [],
      },
      icon: {
        path: "m11.95 38.39 3.67 5.43A2.023 2.023 0 0 1 16 45v13a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V46.259a2 2 0 0 0-.34-1.115L8.71 40.75zM16.95 19.39l6.67 9.43A2.023 2.023 0 0 1 24 30v28a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V31.285a2 2 0 0 0-.367-1.154L13.71 21.75zM51.29 40.75l-2.95 4.394a2 2 0 0 0-.34 1.115V58a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V45a2.023 2.023 0 0 1 .38-1.18l3.67-5.43zM46.29 21.75l-5.923 8.381A2 2 0 0 0 40 31.285V58a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V30a2.023 2.023 0 0 1 .38-1.18l6.67-9.43zM32 12.65V58a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V12.65z",
        fillColor: "#9d1ae5",
        fillOpacity: 1,
        strokeWeight: 0,
      },
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    paths(arr) {
      return arr.map((e) => {
        return { lat: e.lat, lng: e.lon };
      });
    },
    editGetZone() {
      this.onEditfiber.zonePoints = ref(this.$refs.lastShape)
        .value[0].polygon.getPath()
        .getArray()
        .map((e) => e.toJSON());
      this.zoneEditDialog = false;
    },
    getZone() {
      this.addfiber.zonePoints = this.$refs.currentShape.polygon
        .getPath()
        .getArray()
        .map((e) => e.toJSON());
      this.zoneAddDialog = false;
    },
    getPillerGeoPoint(e) {
      this.pillarCurrentLocation = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      this.addPillarDialog = true;
    },
    addPillar() {
      this.addfiber.pillars.push({
        location: {
          lat: this.pillarCurrentLocation.lat,
          lon: this.pillarCurrentLocation.lng,
        },
        number: this.pillarIndexing,
      });
      this.addPillarDialog = false;
      console.log("this is the count of columns", this.addfiber.pillars);
    },
    addZoneDialogRules() {
      console.log(this.whichDialog);
      if (this.addfiber.lon && this.addfiber.lat) {
        this.zoneAddDialog = true;
        if (this.addfiber.zonePoints.length < 2) {
          this.addfiber.zonePoints = [
            {
              lat: this.addfiber.lat - 0.005,
              lng: this.addfiber.lon + 0.005,
            },
            {
              lat: this.addfiber.lat - 0.005,
              lng: this.addfiber.lon - 0.005,
            },
            {
              lat: this.addfiber.lat + 0.005,
              lng: this.addfiber.lon - 0.005,
            },
            {
              lat: this.addfiber.lat + 0.005,
              lng: this.addfiber.lon + 0.005,
            },
          ];
        }
      } else {
        this.locationFirstDialog = true;
      }
    },
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
    undo() {
      this.addDialog = false;
      Object.keys(this.addfiber).forEach((key) => (this.addfiber[key] = null));
      this.whichDialog = null;
    },
    async getData() {
      const response = await get_fiber_service();

      this.data = response.results.data;
      console.log(this.data);
    },
    fiberIconActions(m) {
      this.editDialog = true;
      this.onEditfiber.id = m["_id"];
      this.onEditfiber.name = m.name;
      this.onEditfiber.address = m.address;
      this.onEditfiber.lon = m.location.lon;
      this.onEditfiber.lat = m.location.lat;
      this.onEditfiber.zonePoints = m.zone;
      this.onEditfiber.pillars = m.columns;
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
          location: {
            lon: this.onEditfiber.lon,
            lat: this.onEditfiber.lat,
          },
          zone: this.onEditfiber.zonePoints.map((e) => {
            return {
              lat: e.lat,
              lon: e.lng,
            };
          }),
          columns: this.onEditfiber.pillars,
        });

        console.log(result);
        this.getData();
        this.editDialog = false;
        Object.keys(this.onEditfiber).forEach((key) =>
          key === "zonePoints" || key === "pillars"
            ? (this.onEditfiber[key] = [])
            : (this.onEditfiber[key] = null)
        );
        this.whichDialog = null;
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
    async addSaveBtnActions() {
      this.loading = true;
      try {
        const result = await add_fiber_service({
          name: this.addfiber.name,
          address: this.addfiber.address,
          location: {
            lon: this.addfiber.lon,
            lat: this.addfiber.lat,
          },
          zone: this.addfiber.zonePoints.map((e) => {
            return {
              lat: e.lat,
              lon: e.lng,
            };
          }),
          columns: this.addfiber.pillars,
        });

        console.log(result);

        this.getData();
        this.addDialog = false;
        Object.keys(this.addfiber).forEach((key) =>
          key === "zonePoints" || key === "pillars"
            ? (this.addfiber[key] = [])
            : (this.addfiber[key] = null)
        );
        this.whichDialog = null;
      } catch (error) {
        console.log(error);
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

<style lang="scss" scoped>
.hidden {
  display: none;
}
</style>
