<script>
import {
  add_users_service,
  edit_users_service,
  get_users_service,
  remove_users_service,
} from "@/services/users";
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      dialog: false,
      editDialog: false,
      deleteDialog: false,
      loading: false,
      content_url: "",
      finalMessage: null,
      toBeDeleted: null,
      addData: {
        name: null,
        phone: null,
        password_show: null,
        email: null,
        address: null,
        privileges: { actions: [] },
      },
      onEditAd: {
        id: null,
        name: null,
        phone: null,
        password_show: null,
        email: null,
        address: null,
        privileges: null,
      },
      table: {
        loading: false,
        headers: [
          { title: "الأسم", value: "name" },
          { title: "الهاتف", value: "phone" },
          { title: "كلمة السر", value: "password_show" },
          { title: "الحساب", value: "email" },
          { title: "الموقع", value: "address" },
          { title: "الأمكانات", value: "privileges.actions" },
          { title: "العمليات", value: "actions" },
        ],

        data: [],
        total_data: 0,
        search: null,

        itemsPerPageOptions: [
          { title: "10", value: 10 },
          { title: "20", value: 20 },
          { title: "50", value: 50 },
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
      this.onEditAd.phone = e.phone;
      this.onEditAd.password_show = e.password_show;
      this.onEditAd.email = e.email;
      this.onEditAd.address = e.address;
      this.onEditAd.privileges = e.privileges;
      this.editDialog = true;
      console.log(e);
    },

    async getData() {
      this.table.loading = true;

      const response = await get_users_service({
        page: this.table.options.page,
        limit: this.table.options.itemsPerPage,
        search: this.table.search,
      });

      this.table.data = response.results.data;
      this.table.total_data = response.results.count;
      this.table.loading = false;
      console.log("rest", response.results.data);
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
        const result = await add_users_service({
          name: this.addData.name,
          phone: this.addData.phone,
          password_show: this.addData.password_show,
          email: this.addData.email,
          address: this.addData.address,
          privileges: this.addData.privileges,
        });

        this.getData();
        this.dialog = false;
        this.finalMessage = result.message;
        Object.keys(this.addData).forEach((key) => (this.addData[key] = null));
      } catch (error) {
        console.log("data", this.addData);

        console.log("error", error);
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
        const result = await edit_users_service({
          id: this.onEditAd.id,
          name: this.onEditAd.name,
          phone: this.onEditAd.phone,
          password_show: this.onEditAd.password_show,
          email: this.onEditAd.email,
          address: this.onEditAd.address,
          privileges: this.onEditAd.privileges,
        });

        this.getData();
        this.editDialog = false;

        // this.finalMessage = result.message;
        Object.keys(this.onEditAd).forEach(
          (key) => (this.onEditAd[key] = null)
        );
      } catch (error) {
        console.error("Error editing user:", error);

        // Always return a consistent structure, consider using an object with an 'error' property
        return { error: error };
      }
      this.loading = false;
    },
    async deletingAd() {
      try {
        const result = await remove_users_service(this.toBeDeleted);

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
      <h1 class="text-center mb-5">العروض</h1>
      <VCard class="bg-grey-400">
        <div class="d-flex flex-column justify-sm-space-around">
          <VCard class="pa-3">
            <VRow align="center">
              <!-- add dialog under this comment -->
              <VDialog v-model="dialog" width="1024">
                <template #activator="{ props }">
                  <VBtn
                    color="primary"
                    v-bind="props"
                    append-icon="mdi-add"
                    no-restricted-class
                    class="mt-4 mr-4"
                  >
                    أضافة عرض جديد
                  </VBtn>
                </template>
                <VCard>
                  <VCardTitle class="d-flex mt-5 mr-5">
                    <span v-cloak class="text-h5">أضافة عرض جديد</span>
                  </VCardTitle>
                  <VCardText>
                    <VContainer>
                      <VRow class="">
                        <VCol cols="8">
                          <VTextField
                            v-model="addData.name"
                            label="الأسم"
                            required
                            :hint="fileInputHint"
                          />
                        </VCol>
                        <!-- this is the title holder -->
                        <VCol cols="6">
                          <VTextField
                            v-model="addData.phone"
                            label="الرقم"
                            required
                            :hint="fileInputHint"
                          />
                        </VCol>
                        <!-- this is the phoneNumber holder -->
                        <VCol cols="6">
                          <VTextField
                            v-model="addData.password_show"
                            label="الرمز"
                            required
                          />
                        </VCol>
                        <!-- this is the password holder -->
                        <VCol cols="6">
                          <VTextField
                            v-model="addData.email"
                            label="الحساب"
                            required
                          />
                        </VCol>
                        <!-- this is the password holder -->
                        <VCol cols="6">
                          <VTextField
                            v-model="addData.address"
                            label="محل السكن"
                            required
                          />
                        </VCol>
                        <!-- this is the password holder -->
                        <VCol cols="4">
                          <VSelect
                            v-model="addData.privileges.actions"
                            :items="['add', 'delete']"
                            label="الأمكانات"
                            multiple
                            chips
                          />
                        </VCol>
                        <!-- this is the type holder -->
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
              <!-- editing dialog under this comment -->
              <VDialog v-model="editDialog" width="1024">
                <VCard>
                  <VCardTitle class="d-flex mt-5 mr-5">
                    <span v-cloak class="text-h5">تعديل الأعلان</span>
                  </VCardTitle>
                  <VCardText>
                    <VContainer>
                      <VRow>
                        <VCol cols="8">
                          <VTextField
                            v-model="onEditAd.name"
                            label="الأسم"
                            required
                            :hint="fileInputHint"
                          />
                        </VCol>
                        <!-- this is the title holder -->
                        <VCol cols="6">
                          <VTextField
                            v-model="onEditAd.phone"
                            label="الرقم"
                            required
                            :hint="fileInputHint"
                          />
                        </VCol>
                        <!-- this is the phoneNumber holder -->
                        <VCol cols="6">
                          <VTextField
                            v-model="onEditAd.password_show"
                            label="الرمز"
                            required
                          />
                        </VCol>
                        <!-- this is the password holder -->
                        <VCol cols="6">
                          <VTextField
                            v-model="onEditAd.email"
                            label="الحساب"
                            required
                          />
                        </VCol>
                        <!-- this is the password holder -->
                        <VCol cols="6">
                          <VTextField
                            v-model="onEditAd.address"
                            label="محل السكن"
                            required
                          />
                        </VCol>
                        <!-- this is the password holder -->
                        <VCol cols="4">
                          <VSelect
                            v-model="onEditAd.privileges.actions"
                            :items="['add', 'delete']"
                            label="الأمكانات"
                            multiple
                            chips
                          />
                        </VCol>
                        <!-- this is the type holder -->
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
                      @click="editSaveBtnActions"
                    >
                      موافق
                    </VBtn>
                  </VCardActions>
                </VCard>
              </VDialog>
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
                    <VIcon
                      size="small"
                      class="me-2"
                      @click="editDialogActions(item)"
                    >
                      mdi-pencil
                    </VIcon>
                    <VIcon size="small" @click="deleteIconActions(item)">
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
