<script>
import {
  add_jobs_service,
  edit_jobs_service,
  get_jobs_service,
  remove_jobs_service,
} from "@/services/jobs";
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  data() {
    return {
      privileges: {
        add: false,
        edit: false,
        delete: false,
      },
      formValid: false,
      rules: {
        idNumberRules: [(v) => !!v || "الحقل مطلوب"],
      },
      imageRequired: false,
      dialog: false,
      editDialog: false,
      deleteDialog: false,
      loading: false,
      content_url: "",
      selectedAdImage: "", // this can by the image of the ad on edit or the new ad
      finalMessage: null,
      toBeDeleted: null,
      addData: {
        title: null,
        description: null,
        image: null,
        salary: null,
      },
      onEditAd: {
        id: null,
        title: null,
        description: null,
        image: null,
        salary: null,
        toBeSentImage: null,
      },
      table: {
        loading: false,
        headers: [
          { title: "العنوان", value: "title" },
          { title: "الوصف", value: "description" },
          { title: "الراتب", value: "salary" },
          { title: "الصورة", value: "image" },
          { title: "العمليات", value: "actions" },
        ],

        data: [],
        total_data: 0,
        search: null,

        itemsPerPageOptions: [
          { title: "10", value: 10 },
          { title: "50", value: 50 },
          { title: "100", value: 100 },
          { title: "200", value: 200 },
        ],

        options: {
          page: 1,
          itemsPerPage: 10,
          sortBy: [""],
          sortDesc: [false],
        },
      },
      setup() {
        // Create a ref for the element
        const ImageRef = ref(null);

        // Access the DOM element after the component is mounted
        onMounted(() => {
          toRefs(ImageRef).value;

          // Now 'element' contains the underlying DOM element
        });

        return {
          ImageRef,
        };
      },
    };
  },
  methods: {
    clearAllData() {
      this.dialog = false;
      this.editDialog = false;
      this.selectedAdImage = null;
      this.onEditAd.toBeSentImage = null;
      Object.keys(this.addData).forEach((key) => (this.addData[key] = null));
    },
    currencyFormator(number) {
      return Number(this.financial(number)).toLocaleString("en-US");
    },

    financial(x) {
      if (x === null || x === undefined) return 0;

      return Number.parseFloat(x).toFixed(2);
    },
    editDialogActions(e) {
      this.onEditAd.id = e["_id"];
      this.onEditAd.title = e.title;
      this.onEditAd.description = e.description;
      this.onEditAd.image = e.image;
      this.onEditAd.salary = e.salary;
      this.selectedAdImage = this.content_url + this.onEditAd.image;
      this.editDialog = true;
      this.imageRequired = true;
    },
    clearAdImage() {
      this.$refs.ImageRef.$el.lastElementChild.firstElementChild.childNodes[3].childNodes[4].value =
        "";
      this.addData.image = null;
      this.onEditAd.image = null;
      this.selectedAdImage = null;
      this.imageRequired = false;
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
        this.addData.image = file;
        this.onEditAd.image = file;
        this.onEditAd.toBeSentImage = this.selectedAdImage;
        this.imageRequired = true;
      } else {
        this.addData.image = null;
        this.selectedAdImage = null;
      }
    },

    async getData() {
      JSON.parse(localStorage.getItem("results")).privileges.actions.map(
        (e) => (this.privileges[e] = true)
      );

      this.table.loading = true;

      const response = await get_jobs_service({
        page: this.table.options.page,
        limit: this.table.options.itemsPerPage,
        search: this.table.search,
      });

      this.table.data = response.results.data;
      this.table.total_data = response.results.count;
      this.content_url = response.content_url;
      this.table.loading = false;
    },
    async searchChange() {
      this.table.options.page = 1;
      this.getData();
    },

    async optionsChange(options) {
      this.table.options = options;
      this.getData();
    },

    // here were you send new ad to the api and other stuff --Ali--
    async saveBtnActions() {
      this.loading = true;
      try {
        const result = await add_jobs_service({
          title: this.addData.title,
          description: this.addData.description,
          image: this.selectedAdImage,
          salary: this.addData.salary,
        });

        this.getData();
        this.dialog = false;
        this.finalMessage = result.message;
        this.selectedAdImage = null;
        Object.keys(this.addData).forEach((key) => (this.addData[key] = null));
      } catch (error) {
        this.finalMessage = result.message;
      }
      this.loading = false;
    },
    deleteIconActions(e) {
      this.deleteDialog = true;
      this.toBeDeleted = e["_id"];
    },
    async editSaveBtnActions() {
      this.loading = true;
      try {
        const result = await edit_jobs_service({
          id: this.onEditAd.id,
          title: this.onEditAd.title,
          description: this.onEditAd.description,
          image: this.onEditAd.toBeSentImage
            ? this.onEditAd.toBeSentImage
            : this.onEditAd.image,
          salary: this.onEditAd.salary,
        });

        this.getData();
        this.editDialog = false;
        this.finalMessage = result.message;
        this.selectedAdImage = null;
        Object.keys(this.onEditAd).forEach(
          (key) => (this.onEditAd[key] = null)
        );
        this.addData.image = null;
      } catch (error) {
        this.finalMessage = result.message;
      }
      this.loading = false;
    },
    async deletingAd() {
      try {
        const result = await remove_jobs_service(this.toBeDeleted);

        this.deleteDialog = false;
        this.toBeDeleted = null;
        this.getData();
      } catch (error) {
        this.finalMessage = result.message;
      }
    },
  },
});
</script>

<template>
  <div>
    <VContainer>
      <h1 class="text-center mb-5">الوضائف</h1>
      <VCard class="bg-grey-400">
        <div class="d-flex flex-column justify-sm-space-around">
          <VCard class="pa-3">
            <VRow align="center">
              <!-- add dialog under this comment -->
              <VForm v-model="formValid">
                <VDialog v-model="dialog" width="1024">
                  <template #activator="{ props }">
                    <VBtn
                      color="primary"
                      v-bind="props"
                      append-icon="mdi-add"
                      no-restricted-class
                      class="mt-4 mr-4"
                      :disabled="!privileges.add"
                    >
                      أضافة وضيفة جديده
                    </VBtn>
                  </template>
                  <VCard>
                    <VCardTitle class="d-flex mt-5 mr-5">
                      <span v-cloak class="text-h5">أضافة وظيفه جديده</span>
                    </VCardTitle>
                    <VCardText>
                      <VContainer>
                        <VRow class="">
                          <VCol cols="12">
                            <div
                              class="imgContainer personalImg d-flex align-center"
                            >
                              <div v-show="addData.image" class="imageDisplay">
                                <VImg
                                  v-model="addData.image"
                                  class="imgS"
                                  :src="selectedAdImage"
                                />
                                <button class="deleteBtn" @click="clearAdImage">
                                  <VIcon class="delete_icon"> mdi-close </VIcon>
                                </button>
                              </div>
                              <div
                                v-show="!addData.image"
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
                                <h4>صورة</h4>
                              </div>
                            </div>
                            <h5 :hidden="imageRequired" class="mr-2 mt-3">
                              الصورة مطلوبه
                            </h5>
                          </VCol>

                          <!-- this is the image holder -->
                          <VCol cols="12" sm="8">
                            <VTextField
                              v-model="addData.title"
                              label="عنوان الوضيفة"
                              required
                              :hint="fileInputHint"
                              :rules="rules.idNumberRules"
                            />
                          </VCol>
                          <!-- this is the salary holder -->
                          <VCol cols="12" sm="4">
                            <VTextField
                              v-model="addData.salary"
                              label="الراتب"
                              required
                              :hint="fileInputHint"
                            />
                          </VCol>
                          <!-- this is the salary holder -->
                          <VCol cols="12">
                            <VTextarea
                              v-model="addData.description"
                              label="وصف الوظيفة"
                              required
                              rows="3"
                              :rules="rules.idNumberRules"
                            />
                          </VCol>
                          <!-- this is the description holder -->
                        </VRow>
                      </VContainer>
                    </VCardText>
                    <VCardActions>
                      <VSpacer />
                      <VBtn
                        color="blue-darken-1"
                        variant="text"
                        @click="clearAllData"
                      >
                        ألغاء
                      </VBtn>
                      <VBtn
                        :disabled="!formValid || !imageRequired"
                        :loading="loading"
                        color="blue-darken-1"
                        variant="text"
                        @click="saveBtnActions"
                      >
                        موافق
                      </VBtn>
                    </VCardActions>
                  </VCard>
                </VDialog>
              </VForm>

              <!-- editing dialog under this comment -->
              <VForm v-model="formValid">
                <VDialog v-model="editDialog" width="1024">
                  <VCard>
                    <VCardTitle class="d-flex mt-5 mr-5">
                      <span v-cloak class="text-h5">تعديل الوظيفه</span>
                    </VCardTitle>
                    <VCardText>
                      <VContainer>
                        <VRow>
                          <VCol cols="12">
                            <div class="imgContainer personalImg">
                              <div v-show="onEditAd.image" class="imageDisplay">
                                <VImg
                                  v-model="onEditAd.image"
                                  class="imgS"
                                  :src="selectedAdImage"
                                />
                                <button class="deleteBtn" @click="clearAdImage">
                                  <VIcon class="delete_icon"> mdi-close </VIcon>
                                </button>
                              </div>
                              <div
                                v-show="!onEditAd.image"
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
                                <h4>صورة</h4>
                              </div>
                            </div>
                            <h5 :hidden="imageRequired" class="mr-2 mt-3">
                              الصورة مطلوبه
                            </h5>
                          </VCol>

                          <!-- this is the image holder -->
                          <VCol cols="12" sm="8">
                            <VTextField
                              v-model="onEditAd.title"
                              label="عنوان الوضيفة"
                              required
                              :hint="fileInputHint"
                              :rules="rules.idNumberRules"
                            />
                          </VCol>
                          <!-- this is the salary holder -->
                          <VCol cols="12" sm="4">
                            <VTextField
                              v-model="onEditAd.salary"
                              label="الراتب"
                              required
                              :hint="fileInputHint"
                            />
                          </VCol>
                          <!-- this is the salary holder -->
                          <VCol cols="12">
                            <VTextarea
                              v-model="onEditAd.description"
                              label="وصف الوظيفة"
                              required
                              rows="3"
                              :rules="rules.idNumberRules"
                            />
                          </VCol>
                          <!-- this is the description holder -->
                        </VRow>
                      </VContainer>
                    </VCardText>
                    <VCardActions>
                      <VSpacer />
                      <VBtn
                        color="blue-darken-1"
                        variant="text"
                        @click="clearAllData"
                      >
                        ألغاء
                      </VBtn>
                      <VBtn
                        :disabled="!formValid || !imageRequired"
                        :loading="loading"
                        color="blue-darken-1"
                        variant="text"
                        @click="editSaveBtnActions"
                      >
                        موافق
                      </VBtn>
                    </VCardActions>
                  </VCard>
                </VDialog>
              </VForm>

              <!-- this is delete dialog -->
              <VDialog v-model="deleteDialog" width="auto">
                <VCard>
                  <VCardTitle class="text-h5"> حذف العنصر </VCardTitle>
                  <VCardText>هل فعلا ترغب بحذف هذا العنصر</VCardText>
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
                      @click="deletingAd"
                    >
                      نعم
                    </VBtn>
                  </VCardActions>
                </VCard>
              </VDialog>
            </VRow>
            <VRow>
              <VCol cols="12">
                <VTextField
                  v-model="table.search"
                  label="بحث"
                  single-line
                  hide-details
                  @keyup.enter="searchChange"
                />
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="12" class="pa-0">
                <VDataTableServer
                  class="elevation-2 text-grey-900 m-0"
                  :headers="table.headers"
                  :items="table.data"
                  :items-per-page="table.options.itemsPerPage"
                  :page="table.options.page"
                  items-per-page-text="عدد العناصر بالصفحة"
                  :loading="table.loading"
                  loading-text="جاري تحميل البيانات ..."
                  :items-length="table.total_data"
                  :items-per-page-options="table.itemsPerPageOptions"
                  @update:options="optionsChange($event)"
                >
                  <template #[`item.salary`]="{ item }">
                    <VRow>
                      <VCol> {{ currencyFormator(item.salary) }} </VCol>
                    </VRow>
                  </template>
                  <template #[`item.image`]="{ item }">
                    <VRow>
                      <VCol>
                        <VImg :src="content_url + item.image" width="100" />
                      </VCol>
                    </VRow>
                  </template>
                  <template #[`item.actions`]="{ item }">
                    <VIcon
                      size="small"
                      class="me-2"
                      @click="privileges.edit ? editDialogActions(item) : null"
                    >
                      mdi-pencil
                    </VIcon>
                    <VIcon
                      size="small"
                      @click="
                        privileges.delete ? deleteIconActions(item) : null
                      "
                    >
                      mdi-delete
                    </VIcon>
                  </template>
                </VDataTableServer>
              </VCol>
            </VRow>
          </VCard>
        </div>
      </VCard>
    </VContainer>
  </div>
</template>

<style lang="scss">
@import "../styles/mixins";
@import "../styles/vars";
@import "../styles/placeholders";

// * {
//   border: 1px solid red;
// }
.v-table {
  block-size: 105%;
}

.v-card {
  overflow: visible;
}

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
        padding: 0;
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
