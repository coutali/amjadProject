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
      formValid: false,
      rules: {
        idNumberRules: [(v) => (!!v && v.length > 0) || "الحقل مطلوب"],
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
        phone: null,
        password: null,
        email: null,
        privileges: { actions: [] },
      },
      onEditAd: {
        id: null,
        name: null,
        phone: null,
        password: null,
        email: null,
        privileges: { actions: [] },
      },
      privileges: {
        add: "الأضافة",
        edit: "التعديل",
        delete: "الحذف",
      },
      table: {
        loading: false,
        headers: [
          { title: "الأسم", value: "name" },
          { title: "الهاتف", value: "phone" },
          { title: "كلمة السر", value: "password_show" },
          { title: "الأيميل", value: "email" },
          { title: "الأمكانات", value: "privileges.actions" },
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
      this.onEditAd.phone = e.phone;
      this.onEditAd.password = e.password_show;
      this.onEditAd.email = e.email;
      this.editDialog = true;
      this.onEditAd.privileges.actions = e.privileges.actions.map((ele) => {
        return this.privileges[ele];
      });
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
      let toBeSentPrivileges = { actions: [] };
      for (let [key, val] of Object.entries(this.privileges)) {
        this.addData.privileges.actions.includes(this.privileges[key])
          ? toBeSentPrivileges.actions.push(key)
          : "";
      }
      try {
        const result = await add_users_service({
          name: this.addData.name,
          phone: this.addData.phone,
          password: this.addData.password,
          email: this.addData.email,
          privileges: toBeSentPrivileges,
        });

        this.getData();
        toBeSentPrivileges = { actions: [] };
        this.dialog = false;
        this.finalMessage = result.message;
        Object.keys(this.addData).forEach((key) =>
          key === "privileges"
            ? (this.addData[key].actions = [])
            : (this.addData[key] = null)
        );
      } catch (error) {
        this.finalMessage = error.message;
      }
      this.loading = false;
    },
    deleteIconActions(e) {
      this.deleteDialog = true;
      this.toBeDeleted = e["_id"];
    },
    async editSaveBtnActions() {
      this.loading = true;
      let toBeSentPrivileges = { actions: [] };
      for (let [key, val] of Object.entries(this.privileges)) {
        this.onEditAd.privileges.actions.includes(this.privileges[key])
          ? toBeSentPrivileges.actions.push(key)
          : "";
      }
      try {
        const result = await edit_users_service({
          id: this.onEditAd.id,
          name: this.onEditAd.name,
          phone: this.onEditAd.phone,
          password: this.onEditAd.password,
          email: this.onEditAd.email,
          privileges: toBeSentPrivileges,
        });

        this.getData();
        this.editDialog = false;
        toBeSentPrivileges = { actions: [] };
        this.finalMessage = result.message;
        Object.keys(this.onEditAd).forEach((key) =>
          key === "privileges"
            ? (this.onEditAd[key].actions = [])
            : (this.onEditAd[key] = null)
        );
      } catch (error) {
        this.finalMessage = error.message;
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
      <h1 class="text-center mb-5">المستخدمين</h1>
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
                      أضافة مستخدم جديد
                    </VBtn>
                  </template>
                  <VCard>
                    <VCardTitle class="d-flex mt-5 mr-5">
                      <span v-cloak class="text-h5">أضافة عرض جديد</span>
                    </VCardTitle>
                    <VCardText>
                      <VContainer>
                        <VRow class="">
                          <VCol cols="6">
                            <VTextField
                              v-model="addData.name"
                              label="الأسم"
                              required
                              :hint="fileInputHint"
                              :rules="rules.idNumberRules"
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
                              v-model="addData.password"
                              label="الرمز"
                              required
                              :rules="rules.idNumberRules"
                            />
                          </VCol>
                          <!-- this is the password holder -->
                          <VCol cols="6">
                            <VTextField
                              v-model="addData.email"
                              label="الأيميل"
                              required
                              :rules="rules.idNumberRules"
                            />
                          </VCol>
                          <!-- this is the password holder -->
                          <VCol cols="6">
                            <VSelect
                              v-model="addData.privileges.actions"
                              :items="Object.values(privileges)"
                              label="الأمكانات"
                              multiple
                              chips
                              :rules="rules.idNumberRules"
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
                        :disabled="!formValid"
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
                      <span v-cloak class="text-h5">تعديل الأعلان</span>
                    </VCardTitle>
                    <VCardText>
                      <VContainer>
                        <VRow>
                          <VCol cols="6">
                            <VTextField
                              v-model="onEditAd.name"
                              label="الأسم"
                              required
                              :hint="fileInputHint"
                              :rules="rules.idNumberRules"
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
                              v-model="onEditAd.password"
                              label="الرمز"
                              required
                              :rules="rules.idNumberRules"
                            />
                          </VCol>
                          <!-- this is the password holder -->
                          <VCol cols="6">
                            <VTextField
                              v-model="onEditAd.email"
                              label="الأيميل"
                              required
                              :rules="rules.idNumberRules"
                            />
                          </VCol>
                          <!-- this is the password holder -->
                          <VCol cols="6">
                            <VSelect
                              v-model="onEditAd.privileges.actions"
                              :items="Object.values(privileges)"
                              label="الأمكانات"
                              multiple
                              chips
                              :rules="rules.idNumberRules"
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
                  <template #[`item.privileges.actions`]="{ item }">
                    {{
                      item.privileges.actions
                        .map((ele) => {
                          return privileges[ele];
                        })
                        .sort()
                        .join(" | ")
                    }}
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
