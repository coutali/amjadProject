<template>
  <div>
    <VBtn :disabled="!privileges.add" class="mb-3" @click="addDialog = true">
      أضافة مكتب جديد
    </VBtn>
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
          icon: icon,
          label: m.name,
        }"
        @click="officesIconActions(m)"
      />
    </GoogleMap>
    <VForm v-model="formValid">
      <VDialog v-model="editDialog" width="1024">
        <VCard>
          <VCardTitle class="d-flex mt-5 mr-5">
            <span v-if="privileges.edit" v-cloak class="text-h5"
              >تعديل المكتب</span
            >
            <span v-else v-cloak class="text-h5">ليس لديك امكانيه تعديل</span>
          </VCardTitle>
          <VCardText>
            <VContainer>
              <VRow>
                <VCol cols="12">
                  <div class="imgContainer personalImg d-flex align-center">
                    <div v-show="onEditoffices.image" class="imageDisplay">
                      <VImg
                        v-model="onEditoffices.image"
                        class="imgS"
                        :src="selectedAdImage"
                      />
                      <button
                        v-show="privileges.edit"
                        class="deleteBtn"
                        @click="clearAdImage"
                      >
                        <VIcon class="delete_icon"> mdi-close </VIcon>
                      </button>
                    </div>
                    <div
                      v-show="!onEditoffices.image"
                      class="imgBox"
                      @click="openFileSelectionAdlImg"
                    >
                      <VFileInput
                        v-show="false"
                        ref="ImageRef"
                        type="file"
                        accept="image/*"
                        class="input_style"
                        @change="adImgChange"
                      />
                      <button class="addBtn">+</button>
                      <h4>صورة المنتج</h4>
                    </div>
                  </div>
                </VCol>
                <VCol cols="6">
                  <VTextField
                    v-model="onEditoffices.name"
                    label="اسم المكتب"
                    required
                    :hint="fileInputHint"
                    :rules="rules.idNumberRules"
                    :disabled="!privileges.edit"
                  />
                </VCol>
                <!-- this is the title holder -->
                <VCol cols="6">
                  <VTextField
                    v-model="onEditoffices.address"
                    label="عنوان المكتب"
                    :rules="rules.idNumberRules"
                    :disabled="!privileges.edit"
                  />
                </VCol>
                <!-- this is the category holder -->
                <VCol cols="5">
                  <VTextField
                    v-model="onEditoffices.lon"
                    label="خطوط الطول"
                    required
                    disabled
                    :rules="rules.idNumberRules"
                  />
                </VCol>
                <!-- this is the description holder -->
                <VCol cols="5">
                  <VTextField
                    v-model="onEditoffices.lat"
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
              <VCol cols="3" align="center">
                <VBtn
                  class="bg-red pr-5 pl-5"
                  color="wight-darken-1"
                  variant="text"
                  :disabled="!privileges.delete"
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
    </VForm>

    <VForm v-model="formValid">
      <VDialog v-model="addDialog" width="1024">
        <VCard>
          <VCardTitle class="d-flex mt-5 mr-5">
            <span v-cloak class="text-h5">أضافة مكتب جديد</span>
          </VCardTitle>
          <VCardText>
            <VContainer>
              <VRow>
                <VCol cols="12">
                  <div class="imgContainer personalImg d-flex align-center">
                    <div v-show="addoffices.image" class="imageDisplay">
                      <VImg
                        v-model="addoffices.image"
                        class="imgS"
                        :src="selectedAdImage"
                      />
                      <button
                        :disabled="!privileges.edit"
                        class="deleteBtn"
                        @click="clearAdImage"
                      >
                        <VIcon class="delete_icon"> mdi-close </VIcon>
                      </button>
                    </div>
                    <div
                      v-show="!addoffices.image"
                      class="imgBox"
                      @click="openFileSelectionAdlImg"
                    >
                      <VFileInput
                        v-show="false"
                        ref="ImageRef"
                        type="file"
                        accept="image/*"
                        class="input_style"
                        @change="adImgChange"
                      />
                      <button class="addBtn">+</button>
                      <h4>صورة المنتج</h4>
                    </div>
                  </div>
                </VCol>
                <VCol cols="6">
                  <VTextField
                    v-model="addoffices.name"
                    label="اسم المكتب"
                    required
                    :hint="fileInputHint"
                    :rules="rules.idNumberRules"
                  />
                </VCol>
                <!-- this is the title holder -->
                <VCol cols="6">
                  <VTextField
                    v-model="addoffices.address"
                    label="عنوان المكتب"
                    :rules="rules.idNumberRules"
                  />
                </VCol>
                <!-- this is the category holder -->
                <VCol cols="5">
                  <VTextField
                    v-model="addoffices.lon"
                    label="خطوط العرض"
                    required
                    disabled
                    :rules="rules.idNumberRules"
                  />
                </VCol>
                <!-- this is the description holder -->
                <VCol cols="5">
                  <VTextField
                    v-model="addoffices.lat"
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
      content_url: "",
      privileges: {
        add: false,
        edit: false,
        delete: false,
      },
      formValid: false,
      rules: {
        idNumberRules: [(v) => !!v || "الحقل مطلوب"],
      },
      whichDialog: null,
      editDialog: false,
      addDialog: false,
      deleteDialog: false,
      APIkey: "AIzaSyBwUHuz-wugw92z-ZPO93ZCJyaVLOf9VCg",
      MyLng: null,
      MyLat: null,
      data: [],
      selectedAdImage: null,
      icon: {
        path: "M241.7 3.4c9-4.5 19.6-4.5 28.6 0l160 80c15.8 7.9 22.2 27.1 14.3 42.9C439 137.5 427.7 144 416 144v80c0 17.7-14.3 32-32 32h-4.9l32 192H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H384.5c-.4 0-.8 0-1.1 0H128.6c-.4 0-.8 0-1.1 0H32c-17.7 0-32-14.3-32-32s14.3-32 32-32h68.9l32-192H128c-17.7 0-32-14.3-32-32V144c-11.7 0-23-6.5-28.6-17.7c-7.9-15.8-1.5-35 14.3-42.9l160-80zM314.5 448L256 399.2 197.5 448h117zM197.8 256l-4.7 28.3L256 336.8l62.9-52.5L314.2 256H197.8zm-13.9 83.2l-11.2 67L218.5 368l-34.6-28.8zM293.5 368l45.8 38.1-11.2-67L293.5 368zM176 128c-8.8 0-16 7.2-16 16s7.2 16 16 16H336c8.8 0 16-7.2 16-16s-7.2-16-16-16H176",
        fillColor: "#9d1ae5",
        fillOpacity: 1,
        strokeWeight: 0,
        scale: 0.059,
        className: "marker",
      },
      addoffices: {
        image: null,
        toBeSentImage: null,
        name: null,
        address: null,
        lon: null,
        lat: null,
      },
      onEditoffices: {
        image: null,
        toBeSentImage: null,
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
    clearAdImage() {
      this.$refs.ImageRef.$el.lastElementChild.firstElementChild.childNodes[3].childNodes[4].value =
        "";
      this.onEditoffices.image = null;
      this.addoffices.image = null;
      this.selectedAdImage = null;
    },

    openFileSelectionAdlImg() {
      var id =
        this.$refs.ImageRef.$el.lastElementChild.firstElementChild.childNodes[3]
          .childNodes[4].id;
      document.querySelector(`input#${id}`).click();
    },

    imageToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    },

    async adImgChange(file) {
      if (file) {
        const files = event.target.files;
        if (files.length > 0) {
          this.selectedAdImage = await this.imageToBase64(files[0]);
        }
        this.addoffices.image = file;
        this.onEditoffices.image = file;
        this.onEditoffices.toBeSentImage = this.selectedAdImage;
      } else {
        this.addoffices.image = null;
        this.selectedAdImage = null;
      }
    },

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
    undo() {
      this.addDialog = false;
      Object.keys(this.addoffices).forEach(
        (key) => (this.addoffices[key] = null)
      );
      this.whichDialog = null;
    },
    async getData() {
      const response = await get_offices_service();

      this.content_url = response.content_url;
      this.data = response.results.data;
      JSON.parse(localStorage.getItem("results")).privileges.actions.map(
        (e) => (this.privileges[e] = true)
      );
    },
    officesIconActions(m) {
      this.selectedAdImage = null;
      this.editDialog = true;
      this.onEditoffices.id = m["_id"];
      this.onEditoffices.image = m.image;
      this.selectedAdImage = this.content_url + m.image;
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
          image: this.onEditoffices.toBeSentImage
            ? this.onEditoffices.toBeSentImage
            : this.onEditoffices.image,
          lon: this.onEditoffices.lon,
          lat: this.onEditoffices.lat,
        });

        this.getData();
        this.editDialog = false;
        Object.keys(this.onEditoffices).forEach(
          (key) => (this.onEditoffices[key] = null)
        );
        this.selectedAdImage = null;
        this.whichDialog = null;
      } catch (error) {
        console.log(error);
        this.whichDialog = null;
      }
      this.loading = false;
    },
    async addSaveBtnActions() {
      this.loading = true;
      try {
        const result = await add_offices_service({
          image: this.selectedAdImage,
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
        this.selectedAdImage = null;
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

<style lang="scss" scoped>
@import "../styles/mixins";
@import "../styles/vars";
@import "../styles/placeholders";

.imgContainer {
  block-size: 200px;
  cursor: pointer;
  inline-size: 100%;

  .imageDisplay {
    position: relative;
    block-size: 100%;
    inline-size: 100%;

    .imgS {
      block-size: 100%;
      inline-size: 100%;
      object-fit: contain;
    }

    .deleteBtn {
      @extend %centering;

      position: absolute;
      border: solid 1px $mainColor;
      border-radius: 50%;
      background-color: $mainColor;
      color: $mainColor;
      cursor: pointer;
      inset-block-start: 0;
      inset-inline-end: 15%;

      &:hover {
        background-color: $accColor;
      }

      .delete_icon {
        color: #fff;
        font-size: 1.5rem;
      }

      @include maxQuery(1900px) {
        inset-inline-end: 0;
      }
    }
  }

  .imgBox {
    @extend %centering;

    display: relative;
    border: dashed 3px $mainColor;
    border-radius: 16px;
    block-size: 100%;
    inline-size: 100%;
  }

  .addBtn {
    color: $mainColor;
    font-size: 3rem;
  }
}
</style>
