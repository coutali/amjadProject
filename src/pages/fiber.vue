<template>
  <div>
    <VBtn :disabled="!privileges.add" class="mb-3" @click="addDialog = true">
      أضافة كابينة جديدة
    </VBtn>
    <GoogleMap
      ref="map"
      :api-key="APIkey"
      style="width: 100%; height: calc(100vh - 125px)"
      :center="{ lat: 31.318, lng: 45.2806 }"
      :zoom="14"
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
      <Marker
        v-for="(m, index) in allPillars"
        :key="index"
        ref="pillar"
        :options="{
          position: { lat: m.location.lat, lng: m.location.lon },
          icon: {
            ...icon,
            path: 'M 68.925 69.906 L 68.588 154.038 L 54.627 154.376 L 53.953 69.906 C 49.035 67.244 45.694 62.039 45.694 56.052 C 45.694 47.358 52.744 40.308 61.439 40.308 C 70.133 40.308 77.184 47.358 77.184 56.052 C 77.184 62.039 73.843 67.244 68.925 69.906 Z M 39.32 11.165 C 42.236 9.727 43.431 6.196 41.993 3.283 C 40.555 0.369 37.027 -0.828 34.113 0.609 C 22.213 6.479 12.958 16.19 7.11 27.625 C 2.79 36.07 0.327 45.467 0.03 54.95 C -0.269 64.513 1.617 74.173 6.003 83.064 C 11.404 94.017 20.561 103.759 34.042 110.656 C 36.931 112.133 40.471 110.986 41.947 108.097 C 43.424 105.208 42.278 101.669 39.389 100.193 C 28.352 94.548 20.903 86.668 16.556 77.859 C 13.05 70.748 11.542 63.002 11.782 55.32 C 12.025 47.563 14.038 39.878 17.572 32.972 C 22.304 23.721 29.76 15.879 39.32 11.165 Z M 88.765 0.608 C 85.851 -0.83 82.322 0.368 80.884 3.282 C 79.446 6.196 80.642 9.727 83.558 11.164 C 93.119 15.879 100.575 23.72 105.305 32.972 C 108.838 39.877 110.852 47.562 111.094 55.32 C 111.334 63.002 109.826 70.748 106.321 77.859 C 101.974 86.668 94.525 94.548 83.488 100.193 C 80.599 101.67 79.454 105.209 80.93 108.097 C 82.406 110.986 85.946 112.132 88.835 110.656 C 102.315 103.76 111.473 94.017 116.874 83.064 C 121.26 74.173 123.146 64.513 122.847 54.95 C 122.55 45.467 120.087 36.07 115.768 27.625 C 109.919 16.19 100.665 6.479 88.765 0.608 Z M 82.791 26.505 C 80.596 24.924 77.535 25.423 75.954 27.618 C 74.374 29.813 74.872 32.874 77.067 34.455 C 77.952 35.092 78.82 35.807 79.671 36.589 C 84.642 41.172 87.59 47.283 88.209 53.749 C 88.835 60.273 87.098 67.186 82.691 73.301 C 81.943 74.34 81.081 75.393 80.106 76.451 C 78.271 78.443 78.398 81.549 80.393 83.383 C 82.387 85.217 85.492 85.088 87.326 83.096 C 88.506 81.817 89.612 80.455 90.641 79.024 C 96.503 70.885 98.807 61.624 97.963 52.827 C 97.115 43.974 93.092 35.619 86.315 29.37 C 85.249 28.387 84.074 27.431 82.791 26.505 Z M 45.81 34.458 C 48.005 32.877 48.504 29.816 46.923 27.621 C 45.342 25.426 42.281 24.927 40.086 26.507 C 38.802 27.433 37.628 28.389 36.562 29.371 C 29.784 35.621 25.761 43.975 24.913 52.828 C 24.069 61.624 26.373 70.888 32.236 79.027 C 33.267 80.457 34.372 81.818 35.551 83.097 C 37.385 85.089 40.49 85.218 42.483 83.384 C 44.479 81.55 44.606 78.445 42.771 76.452 C 41.796 75.393 40.934 74.341 40.186 73.302 C 35.78 67.187 34.042 60.275 34.668 53.751 C 35.287 47.286 38.235 41.174 43.206 36.591 C 44.058 35.81 44.926 35.095 45.81 34.458 Z',
            scale: 0.15,
          },
        }"
      />
    </GoogleMap>
    <VForm v-model="formValid" ref="form">
      <VDialog v-model="editDialog" width="1024">
        <VCard>
          <VCardTitle class="d-flex mt-5 mr-5">
            <span v-if="privileges.edit" v-cloak class="text-h5"
              >تعديل الكابينة</span
            >
            <span v-else v-cloak class="text-h5">ليس لديك امكانية تعديل</span>
          </VCardTitle>
          <VCardText>
            <VContainer>
              <VRow>
                <VCol cols="12" sm="6">
                  <VTextField
                    v-model="onEditfiber.name"
                    label="اسم الكابينة"
                    required
                    :hint="fileInputHint"
                    :disabled="!privileges.edit"
                  />
                </VCol>
                <!-- this is the title holder -->
                <VCol cols="12" sm="6">
                  <VTextField
                    v-model="onEditfiber.address"
                    label="عنوان الكابينة"
                    :rules="rules.idNumberRules"
                    :disabled="!privileges.edit"
                  />
                </VCol>
                <!-- this is the category holder -->
                <VCol cols="12" sm="5">
                  <VTextField
                    v-model="onEditfiber.lon"
                    label="خطوط الطول"
                    required
                    disabled
                    :rules="rules.idNumberRules"
                  />
                </VCol>
                <!-- this is the description holder -->
                <VCol sm="5" cols="12">
                  <VTextField
                    v-model="onEditfiber.lat"
                    label="خطوط العرض"
                    required
                    disabled
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
                    :disabled="!privileges.edit"
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
              <VCol cols="12" sm="3" align="center">
                <VBtn
                  :disabled="!privileges.delete"
                  class="bg-red pr-5 pl-5"
                  color="wight-darken-1"
                  variant="text"
                  @click="deleteDialog = true"
                >
                  حذف الكابينة
                </VBtn>
              </VCol>
              <VCol xl="none" cols="6">
                <VSpacer />
              </VCol>
              <VCol cols="12" sm="3" align="center">
                <VBtn
                  :disabled="!privileges.edit"
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
                <VCol cols="12" sm="6">
                  <VTextField
                    class="input"
                    v-model="addfiber.name"
                    label="اسم الكابينة"
                    required
                    :rules="rules.idNumberRules"
                  />
                </VCol>
                <!-- this is the title holder -->
                <VCol cols="12" sm="6">
                  <VTextField
                    class="input"
                    v-model="addfiber.address"
                    label="عنوان الكابينة"
                    :rules="rules.idNumberRules"
                  />
                </VCol>
                <!-- this is the category holder -->
                <VCol cols="12" sm="5">
                  <VTextField
                    v-model="addfiber.lon"
                    label="خطوط العرض"
                    required
                    disabled
                    :rules="rules.idNumberRules"
                  />
                </VCol>
                <!-- this is the description holder -->
                <VCol cols="12" sm="5">
                  <VTextField
                    v-model="addfiber.lat"
                    label="خطوط الطول"
                    required
                    disabled
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
                  <VBtn @click="addChangeBtn"> تحديد الموقع </VBtn>
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
                    style="width: 100%; font-weight: 700"
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
              <VCol cols="0" sm="9">
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
    <VDialog v-model="pillarRequired" width="auto">
      <VCard
        max-width="400"
        prepend-icon="mdi-box"
        title="يرجى أضافة عمود واحد على الاقل"
        text="انقر داخل الزون الذي حددته لأضافة عمود جديد"
      >
        <VBtn
          variant="text"
          class="ms-auto"
          text="Ok"
          @click="pillarRequired = false"
        />
      </VCard>
    </VDialog>
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
    <VForm v-model="pillarValid">
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
                  :disabled="!pillarValid"
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
            <VCol cols="12" sm="10">
              <span v-cloak class="text-h5">تعديل الزون والأعمدة</span>
            </VCol>
            <VCol
              cols="12"
              sm="2"
              align="right"
              style="display: flex; gap: 10px"
            >
              <VBtn @click="zoneDialogClose"> ألغاء </VBtn>
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
                    ...icon,
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
                    ...icon,
                    path: 'M 68.925 69.906 L 68.588 154.038 L 54.627 154.376 L 53.953 69.906 C 49.035 67.244 45.694 62.039 45.694 56.052 C 45.694 47.358 52.744 40.308 61.439 40.308 C 70.133 40.308 77.184 47.358 77.184 56.052 C 77.184 62.039 73.843 67.244 68.925 69.906 Z M 39.32 11.165 C 42.236 9.727 43.431 6.196 41.993 3.283 C 40.555 0.369 37.027 -0.828 34.113 0.609 C 22.213 6.479 12.958 16.19 7.11 27.625 C 2.79 36.07 0.327 45.467 0.03 54.95 C -0.269 64.513 1.617 74.173 6.003 83.064 C 11.404 94.017 20.561 103.759 34.042 110.656 C 36.931 112.133 40.471 110.986 41.947 108.097 C 43.424 105.208 42.278 101.669 39.389 100.193 C 28.352 94.548 20.903 86.668 16.556 77.859 C 13.05 70.748 11.542 63.002 11.782 55.32 C 12.025 47.563 14.038 39.878 17.572 32.972 C 22.304 23.721 29.76 15.879 39.32 11.165 Z M 88.765 0.608 C 85.851 -0.83 82.322 0.368 80.884 3.282 C 79.446 6.196 80.642 9.727 83.558 11.164 C 93.119 15.879 100.575 23.72 105.305 32.972 C 108.838 39.877 110.852 47.562 111.094 55.32 C 111.334 63.002 109.826 70.748 106.321 77.859 C 101.974 86.668 94.525 94.548 83.488 100.193 C 80.599 101.67 79.454 105.209 80.93 108.097 C 82.406 110.986 85.946 112.132 88.835 110.656 C 102.315 103.76 111.473 94.017 116.874 83.064 C 121.26 74.173 123.146 64.513 122.847 54.95 C 122.55 45.467 120.087 36.07 115.768 27.625 C 109.919 16.19 100.665 6.479 88.765 0.608 Z M 82.791 26.505 C 80.596 24.924 77.535 25.423 75.954 27.618 C 74.374 29.813 74.872 32.874 77.067 34.455 C 77.952 35.092 78.82 35.807 79.671 36.589 C 84.642 41.172 87.59 47.283 88.209 53.749 C 88.835 60.273 87.098 67.186 82.691 73.301 C 81.943 74.34 81.081 75.393 80.106 76.451 C 78.271 78.443 78.398 81.549 80.393 83.383 C 82.387 85.217 85.492 85.088 87.326 83.096 C 88.506 81.817 89.612 80.455 90.641 79.024 C 96.503 70.885 98.807 61.624 97.963 52.827 C 97.115 43.974 93.092 35.619 86.315 29.37 C 85.249 28.387 84.074 27.431 82.791 26.505 Z M 45.81 34.458 C 48.005 32.877 48.504 29.816 46.923 27.621 C 45.342 25.426 42.281 24.927 40.086 26.507 C 38.802 27.433 37.628 28.389 36.562 29.371 C 29.784 35.621 25.761 43.975 24.913 52.828 C 24.069 61.624 26.373 70.888 32.236 79.027 C 33.267 80.457 34.372 81.818 35.551 83.097 C 37.385 85.089 40.49 85.218 42.483 83.384 C 44.479 81.55 44.606 78.445 42.771 76.452 C 41.796 75.393 40.934 74.341 40.186 73.302 C 35.78 67.187 34.042 60.275 34.668 53.751 C 35.287 47.286 38.235 41.174 43.206 36.591 C 44.058 35.81 44.926 35.095 45.81 34.458 Z',
                    scale: 0.15,
                  },
                }"
              />
              <Marker
                v-for="(m, index) in allPillars"
                :key="index"
                :options="{
                  position: { lat: m.location.lat, lng: m.location.lon },
                  icon: {
                    ...icon,
                    fillColor: '#000000',
                    path: 'M 68.925 69.906 L 68.588 154.038 L 54.627 154.376 L 53.953 69.906 C 49.035 67.244 45.694 62.039 45.694 56.052 C 45.694 47.358 52.744 40.308 61.439 40.308 C 70.133 40.308 77.184 47.358 77.184 56.052 C 77.184 62.039 73.843 67.244 68.925 69.906 Z M 39.32 11.165 C 42.236 9.727 43.431 6.196 41.993 3.283 C 40.555 0.369 37.027 -0.828 34.113 0.609 C 22.213 6.479 12.958 16.19 7.11 27.625 C 2.79 36.07 0.327 45.467 0.03 54.95 C -0.269 64.513 1.617 74.173 6.003 83.064 C 11.404 94.017 20.561 103.759 34.042 110.656 C 36.931 112.133 40.471 110.986 41.947 108.097 C 43.424 105.208 42.278 101.669 39.389 100.193 C 28.352 94.548 20.903 86.668 16.556 77.859 C 13.05 70.748 11.542 63.002 11.782 55.32 C 12.025 47.563 14.038 39.878 17.572 32.972 C 22.304 23.721 29.76 15.879 39.32 11.165 Z M 88.765 0.608 C 85.851 -0.83 82.322 0.368 80.884 3.282 C 79.446 6.196 80.642 9.727 83.558 11.164 C 93.119 15.879 100.575 23.72 105.305 32.972 C 108.838 39.877 110.852 47.562 111.094 55.32 C 111.334 63.002 109.826 70.748 106.321 77.859 C 101.974 86.668 94.525 94.548 83.488 100.193 C 80.599 101.67 79.454 105.209 80.93 108.097 C 82.406 110.986 85.946 112.132 88.835 110.656 C 102.315 103.76 111.473 94.017 116.874 83.064 C 121.26 74.173 123.146 64.513 122.847 54.95 C 122.55 45.467 120.087 36.07 115.768 27.625 C 109.919 16.19 100.665 6.479 88.765 0.608 Z M 82.791 26.505 C 80.596 24.924 77.535 25.423 75.954 27.618 C 74.374 29.813 74.872 32.874 77.067 34.455 C 77.952 35.092 78.82 35.807 79.671 36.589 C 84.642 41.172 87.59 47.283 88.209 53.749 C 88.835 60.273 87.098 67.186 82.691 73.301 C 81.943 74.34 81.081 75.393 80.106 76.451 C 78.271 78.443 78.398 81.549 80.393 83.383 C 82.387 85.217 85.492 85.088 87.326 83.096 C 88.506 81.817 89.612 80.455 90.641 79.024 C 96.503 70.885 98.807 61.624 97.963 52.827 C 97.115 43.974 93.092 35.619 86.315 29.37 C 85.249 28.387 84.074 27.431 82.791 26.505 Z M 45.81 34.458 C 48.005 32.877 48.504 29.816 46.923 27.621 C 45.342 25.426 42.281 24.927 40.086 26.507 C 38.802 27.433 37.628 28.389 36.562 29.371 C 29.784 35.621 25.761 43.975 24.913 52.828 C 24.069 61.624 26.373 70.888 32.236 79.027 C 33.267 80.457 34.372 81.818 35.551 83.097 C 37.385 85.089 40.49 85.218 42.483 83.384 C 44.479 81.55 44.606 78.445 42.771 76.452 C 41.796 75.393 40.934 74.341 40.186 73.302 C 35.78 67.187 34.042 60.275 34.668 53.751 C 35.287 47.286 38.235 41.174 43.206 36.591 C 44.058 35.81 44.926 35.095 45.81 34.458 Z',
                    scale: 0.15,
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
            <VCol sm="10" cols="12">
              <span v-cloak class="text-h5">تعديل الزون والأعمدة</span>
            </VCol>
            <VCol
              sm="2"
              cols="12"
              align="right"
              style="display: flex; gap: 10px"
            >
              <VBtn @click="zoneEditDialog = false"> ألغاء </VBtn>
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
              <!-- this is the capine -->
              <div v-for="(p, i) in data" :key="i">
                <!-- now this is the other capines -->
                <div v-if="p['_id'] !== onEditfiber.id">
                  <Marker
                    :options="{
                      position: { lat: p.location.lat, lng: p.location.lon },
                      icon: {
                        ...icon,
                        fillColor: '#000000',
                        fillOpacity: 0.5,
                      },
                      label: p.name,
                    }"
                  />
                  <!-- this is all there pillars aka columns -->
                  <Marker
                    v-for="(p, index) in p.columns"
                    :key="index"
                    :options="{
                      position: { lat: p.location.lat, lng: p.location.lon },
                      icon: {
                        ...icon,
                        path: 'M 68.925 69.906 L 68.588 154.038 L 54.627 154.376 L 53.953 69.906 C 49.035 67.244 45.694 62.039 45.694 56.052 C 45.694 47.358 52.744 40.308 61.439 40.308 C 70.133 40.308 77.184 47.358 77.184 56.052 C 77.184 62.039 73.843 67.244 68.925 69.906 Z M 39.32 11.165 C 42.236 9.727 43.431 6.196 41.993 3.283 C 40.555 0.369 37.027 -0.828 34.113 0.609 C 22.213 6.479 12.958 16.19 7.11 27.625 C 2.79 36.07 0.327 45.467 0.03 54.95 C -0.269 64.513 1.617 74.173 6.003 83.064 C 11.404 94.017 20.561 103.759 34.042 110.656 C 36.931 112.133 40.471 110.986 41.947 108.097 C 43.424 105.208 42.278 101.669 39.389 100.193 C 28.352 94.548 20.903 86.668 16.556 77.859 C 13.05 70.748 11.542 63.002 11.782 55.32 C 12.025 47.563 14.038 39.878 17.572 32.972 C 22.304 23.721 29.76 15.879 39.32 11.165 Z M 88.765 0.608 C 85.851 -0.83 82.322 0.368 80.884 3.282 C 79.446 6.196 80.642 9.727 83.558 11.164 C 93.119 15.879 100.575 23.72 105.305 32.972 C 108.838 39.877 110.852 47.562 111.094 55.32 C 111.334 63.002 109.826 70.748 106.321 77.859 C 101.974 86.668 94.525 94.548 83.488 100.193 C 80.599 101.67 79.454 105.209 80.93 108.097 C 82.406 110.986 85.946 112.132 88.835 110.656 C 102.315 103.76 111.473 94.017 116.874 83.064 C 121.26 74.173 123.146 64.513 122.847 54.95 C 122.55 45.467 120.087 36.07 115.768 27.625 C 109.919 16.19 100.665 6.479 88.765 0.608 Z M 82.791 26.505 C 80.596 24.924 77.535 25.423 75.954 27.618 C 74.374 29.813 74.872 32.874 77.067 34.455 C 77.952 35.092 78.82 35.807 79.671 36.589 C 84.642 41.172 87.59 47.283 88.209 53.749 C 88.835 60.273 87.098 67.186 82.691 73.301 C 81.943 74.34 81.081 75.393 80.106 76.451 C 78.271 78.443 78.398 81.549 80.393 83.383 C 82.387 85.217 85.492 85.088 87.326 83.096 C 88.506 81.817 89.612 80.455 90.641 79.024 C 96.503 70.885 98.807 61.624 97.963 52.827 C 97.115 43.974 93.092 35.619 86.315 29.37 C 85.249 28.387 84.074 27.431 82.791 26.505 Z M 45.81 34.458 C 48.005 32.877 48.504 29.816 46.923 27.621 C 45.342 25.426 42.281 24.927 40.086 26.507 C 38.802 27.433 37.628 28.389 36.562 29.371 C 29.784 35.621 25.761 43.975 24.913 52.828 C 24.069 61.624 26.373 70.888 32.236 79.027 C 33.267 80.457 34.372 81.818 35.551 83.097 C 37.385 85.089 40.49 85.218 42.483 83.384 C 44.479 81.55 44.606 78.445 42.771 76.452 C 41.796 75.393 40.934 74.341 40.186 73.302 C 35.78 67.187 34.042 60.275 34.668 53.751 C 35.287 47.286 38.235 41.174 43.206 36.591 C 44.058 35.81 44.926 35.095 45.81 34.458 Z',
                        fillColor: '#000000',
                        fillOpacity: 0.5,
                        scale: 0.15,
                      },
                    }"
                  />
                </div>
                <div v-else>
                  <!-- this is the on edit capien -->
                  <Marker
                    :options="{
                      position: { lat: p.location.lat, lng: p.location.lon },
                      icon: icon,
                      label: p.name,
                    }"
                    @click="fiberIconActions(m)"
                  />
                  <!-- this is the on edit capien pillars -->
                  <Marker
                    v-for="(p, index) in onEditfiber.pillars"
                    :key="index"
                    :options="{
                      position: { lat: p.location.lat, lng: p.location.lon },
                      icon: {
                        ...icon,
                        path: 'M 68.925 69.906 L 68.588 154.038 L 54.627 154.376 L 53.953 69.906 C 49.035 67.244 45.694 62.039 45.694 56.052 C 45.694 47.358 52.744 40.308 61.439 40.308 C 70.133 40.308 77.184 47.358 77.184 56.052 C 77.184 62.039 73.843 67.244 68.925 69.906 Z M 39.32 11.165 C 42.236 9.727 43.431 6.196 41.993 3.283 C 40.555 0.369 37.027 -0.828 34.113 0.609 C 22.213 6.479 12.958 16.19 7.11 27.625 C 2.79 36.07 0.327 45.467 0.03 54.95 C -0.269 64.513 1.617 74.173 6.003 83.064 C 11.404 94.017 20.561 103.759 34.042 110.656 C 36.931 112.133 40.471 110.986 41.947 108.097 C 43.424 105.208 42.278 101.669 39.389 100.193 C 28.352 94.548 20.903 86.668 16.556 77.859 C 13.05 70.748 11.542 63.002 11.782 55.32 C 12.025 47.563 14.038 39.878 17.572 32.972 C 22.304 23.721 29.76 15.879 39.32 11.165 Z M 88.765 0.608 C 85.851 -0.83 82.322 0.368 80.884 3.282 C 79.446 6.196 80.642 9.727 83.558 11.164 C 93.119 15.879 100.575 23.72 105.305 32.972 C 108.838 39.877 110.852 47.562 111.094 55.32 C 111.334 63.002 109.826 70.748 106.321 77.859 C 101.974 86.668 94.525 94.548 83.488 100.193 C 80.599 101.67 79.454 105.209 80.93 108.097 C 82.406 110.986 85.946 112.132 88.835 110.656 C 102.315 103.76 111.473 94.017 116.874 83.064 C 121.26 74.173 123.146 64.513 122.847 54.95 C 122.55 45.467 120.087 36.07 115.768 27.625 C 109.919 16.19 100.665 6.479 88.765 0.608 Z M 82.791 26.505 C 80.596 24.924 77.535 25.423 75.954 27.618 C 74.374 29.813 74.872 32.874 77.067 34.455 C 77.952 35.092 78.82 35.807 79.671 36.589 C 84.642 41.172 87.59 47.283 88.209 53.749 C 88.835 60.273 87.098 67.186 82.691 73.301 C 81.943 74.34 81.081 75.393 80.106 76.451 C 78.271 78.443 78.398 81.549 80.393 83.383 C 82.387 85.217 85.492 85.088 87.326 83.096 C 88.506 81.817 89.612 80.455 90.641 79.024 C 96.503 70.885 98.807 61.624 97.963 52.827 C 97.115 43.974 93.092 35.619 86.315 29.37 C 85.249 28.387 84.074 27.431 82.791 26.505 Z M 45.81 34.458 C 48.005 32.877 48.504 29.816 46.923 27.621 C 45.342 25.426 42.281 24.927 40.086 26.507 C 38.802 27.433 37.628 28.389 36.562 29.371 C 29.784 35.621 25.761 43.975 24.913 52.828 C 24.069 61.624 26.373 70.888 32.236 79.027 C 33.267 80.457 34.372 81.818 35.551 83.097 C 37.385 85.089 40.49 85.218 42.483 83.384 C 44.479 81.55 44.606 78.445 42.771 76.452 C 41.796 75.393 40.934 74.341 40.186 73.302 C 35.78 67.187 34.042 60.275 34.668 53.751 C 35.287 47.286 38.235 41.174 43.206 36.591 C 44.058 35.81 44.926 35.095 45.81 34.458 Z',
                        scale: 0.15,
                      },
                    }"
                  />
                </div>
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
import { defineComponent, ref } from "vue";
import { GoogleMap, Marker, Polygon } from "vue3-google-map";

export default defineComponent({
  components: { GoogleMap, Marker, Polygon },
  data() {
    return {
      pillarValid: false,
      privileges: {
        add: false,
        edit: false,
        delete: false,
      },
      allPillars: [],
      options: {
        paths: [],
        strokeColor: "#9d1ae5",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#9d1ae5",
        fillOpacity: 0.25,
        editable: true,
      },

      formValid: false,

      rules: {
        idNumberRules: [(v) => !!v || "الحقل مطلوب"],
      },
      pillarIndexing: null,
      pillarCurrentLocation: null,
      pillarRequired: false,
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
        path: "M407 0H105c-5.522 0-10 4.477-10 10v450.926c0 5.522 4.478 10 10 10h31V502c0 5.522 4.477 10 10 10h50c5.523 0 10-4.478 10-10v-31.074h100V502c0 5.522 4.478 10 10 10h50c5.522 0 10-4.478 10-10v-31.074h31c5.522 0 10-4.478 10-10V10c0-5.523-4.478-10-10-10zm-10 20v341.372h-20V50.895c0-5.522-4.478-10-10-10H145c-5.523 0-10 4.478-10 10v310.477h-20V20zm-40 181.186H155v-60.145h202zm-202 20h202v60.146H155zm202-100.145H155V60.896h202zM155 361.372v-60.04h202v60.04zM186 492h-30v-21.074h30zm170 0h-30v-21.074h30zm-241-41.074v-69.554c65.148.035 231.569.191 282 0v69.554H115z",
        fillColor: "#9d1ae5",
        fillOpacity: 1,
        strokeWeight: 0,
        scale: 0.09,
      },
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    zoneDialogClose() {
      this.zoneAddDialog = false;
      this.zoneEditDialog = false;
    },
    getAllPillars() {
      let localPillars = [];
      for (let each of this.data) {
        localPillars.push(...each.columns);
      }
      return (this.allPillars = localPillars);
    },
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
      if (this.addfiber.pillars.length > 0) {
        this.addfiber.zonePoints = this.$refs.currentShape.polygon
          .getPath()
          .getArray()
          .map((e) => e.toJSON());
        this.zoneAddDialog = false;
      } else {
        this.pillarRequired = true;
      }
    },
    getPillerGeoPoint(e) {
      this.pillarCurrentLocation = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      this.addPillarDialog = true;
    },
    addPillar() {
      if (this.whichDialog === "edit") {
        this.onEditfiber.pillars.push({
          location: {
            lat: this.pillarCurrentLocation.lat,
            lon: this.pillarCurrentLocation.lng,
          },
          number: this.pillarIndexing,
        });
      } else {
        this.addfiber.pillars.push({
          location: {
            lat: this.pillarCurrentLocation.lat,
            lon: this.pillarCurrentLocation.lng,
          },
          number: this.pillarIndexing,
        });
      }
      this.addPillarDialog = false;
    },
    addZoneDialogRules() {
      if (this.addfiber.lon && this.addfiber.lat) {
        this.zoneAddDialog = true;
        if (
          this.addfiber.zonePoints.length < 2 ||
          this.addfiber.zonePoints === null
        ) {
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
      this.doThis();
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
      } else {
      }
    },
    undo() {
      this.addDialog = false;
      Object.keys(this.addfiber).forEach((key) =>
        key === "zonePoints" || key === "pillars"
          ? (this.addfiber[key] = [])
          : (this.addfiber[key] = null)
      );
      this.whichDialog = null;
    },
    async getData() {
      const response = await get_fiber_service();

      this.data = response.results.data;
      this.getAllPillars();
      JSON.parse(localStorage.getItem("results")).privileges.actions.map(
        (e) => (this.privileges[e] = true)
      );
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

        this.getData();
        this.editDialog = false;
        Object.keys(this.onEditfiber).forEach((key) =>
          key === "zonePoints" || key === "pillars"
            ? (this.onEditfiber[key] = [])
            : (this.onEditfiber[key] = null)
        );
        this.whichDialog = null;
      } catch (error) {}
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

        this.getData();
        this.addDialog = false;
        Object.keys(this.addfiber).forEach((key) =>
          key === "zonePoints" || key === "pillars"
            ? (this.addfiber[key] = [])
            : (this.addfiber[key] = null)
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

<style lang="scss" scoped>
.hidden {
  display: none;
}
</style>
