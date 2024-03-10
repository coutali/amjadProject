<script>
import {
  add_products_category_service,
  edit_products_category_service,
  get_products_category_service,
  remove_products_category_service,
} from "@/services/category";
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      formValid: false,
      rules: {
        idNumberRules: [(v) => !!v || "الحقل مطلوب"],
      },
      dialog: false,
      editDialog: false,
      deleteDialog: false,
      loading: false,
      content_url: "",
      finalMessage: null,
      toBeDeleted: null,
      addData: {
        name: null,
      },
      onEditAd: {
        id: null,
        name: null,
      },
      table: {
        loading: false,
        headers: [
          { title: "التصنيف", value: "name" },
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
    };
  },
  methods: {
    editDialogActions(e) {
      this.onEditAd.id = e["_id"];
      this.onEditAd.name = e.name;
      this.editDialog = true;
    },

    async getData() {
      this.table.loading = true;

      const response = await get_products_category_service({
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
        const result = await add_products_category_service({
          name: this.addData.name,
        });

        this.getData();
        this.dialog = false;
        this.finalMessage = result.message;
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
        const result = await edit_products_category_service({
          id: this.onEditAd.id,
          name: this.onEditAd.name,
        });

        this.getData();
        this.editDialog = false;
        this.finalMessage = result.message;
        Object.keys(this.onEditAd).forEach(
          (key) => (this.onEditAd[key] = null)
        );
      } catch (error) {
        this.finalMessage = result.message;
      }
      this.loading = false;
    },
    async deletingAd() {
      try {
        const result = await remove_products_category_service(this.toBeDeleted);

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
      <h1 class="text-center mb-5">التصنيفات</h1>
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
                    >
                      أضافة تصنيف جديد
                    </VBtn>
                  </template>
                  <VCard>
                    <VCardTitle class="d-flex mt-5 mr-5">
                      <span v-cloak class="text-h5">أضافة تصنيف جديد</span>
                    </VCardTitle>
                    <VCardText>
                      <VContainer>
                        <VRow class="">
                          <VCol cols="12">
                            <VTextField
                              v-model="addData.name"
                              label="أسم التصنيف"
                              required
                              :hint="fileInputHint"
                              :rules="rules.idNumberRules"
                            />
                          </VCol>
                          <!-- this is the price holder -->
                        </VRow>
                      </VContainer>
                    </VCardText>
                    <VCardActions>
                      <VSpacer />
                      <VBtn
                        color="blue-darken-1"
                        variant="text"
                        @click="dialog = false"
                      >
                        ألغاء
                      </VBtn>
                      <VBtn
                        :disabled="!formValid"
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
                      <span v-cloak class="text-h5">تعديل التصنيف</span>
                    </VCardTitle>
                    <VCardText>
                      <VContainer>
                        <VRow>
                          <VCol cols="12">
                            <VTextField
                              v-model="onEditAd.name"
                              label="أسم التصنيف"
                              required
                              :hint="fileInputHint"
                              :rules="rules.idNumberRules"
                            />
                          </VCol>
                          <!-- this is the price holder -->
                        </VRow>
                      </VContainer>
                    </VCardText>
                    <VCardActions>
                      <VSpacer />
                      <VBtn
                        color="blue-darken-1"
                        variant="text"
                        @click="editDialog = false"
                      >
                        ألغاء
                      </VBtn>
                      <VBtn
                        :loading="loading"
                        color="blue-darken-1"
                        variant="text"
                        :disabled="!formValid"
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
                  <template #[`item.actions`]="{ item }">
                    <VIcon size="large" @click="editDialogActions(item)">
                      mdi-pencil
                    </VIcon>
                    <VIcon size="large" @click="deleteIconActions(item)">
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
