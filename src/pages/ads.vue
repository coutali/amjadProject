<template>
  <v-data-table-server
    :headers="table.headers"
    :items="api_data.data"
    :items-length="api_data.total"
    :loading="api_data.loading"
    :items-per-page="5"
    no-data-text="لا يوجد بيانات"
    :expand-on-click="false"
    items-per-page-text="عدد العناصر في الصفحة"
    @update:options="initialize"
    vbtn
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title align="center">الأعلانات</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ props }">
            <v-btn color="primary" dark class="mb-2" v-bind="props">
              أضافة أعلان
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="editedItem.title"
                      label="العنوان"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-file-input
                      v-model="editedItem.image"
                      label="الصورة"
                      accept="image/*"
                    ></v-file-input>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="editedItem.description"
                      label="الوصف"
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="close">
                ألغاء
              </v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="save">
                حفظ
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >هل فعلا تريد حذف هذا الأعلان ؟</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete"
                >ألغاء</v-btn
              >
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="deleteItemConfirm"
                >نعم</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.image`]="{ item }">
      <v-img
        width="100"
        height="100"
        :src="content_url + item.columns.image"
      ></v-img>
    </template>

    <template v-slot:[`item.actions`]="{ item }">
      <v-icon size="small" class="me-2" @click="editItem(item)">
        mdi-pencil
      </v-icon>
      <v-icon size="small" @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
  </v-data-table-server>
</template>
<script>
import { get_ads_service } from "@/services/ads";
import { VDataTableServer } from "vuetify/labs/VDataTable";

export default {
  components: {
    VDataTableServer,
  },
  data: () => ({
    dialog: false,
    dialogDelete: false,

    table: {
      page: 1,
      limit: 10,
      headers: [
        { title: "العنوان", key: "title", sortable: true },
        {
          title: "الصورة",
          align: "start",
          sortable: true,
          key: "image",
        },
        { title: "الوصف", key: "description" },
        { title: "العمليات", key: "actions" },
      ],
    },

    api_data: {
      loading: false,
      data: [],
      total: 0,
    },
    editedIndex: -1,
    editedItem: {
      title: null,
      image: null,
      description: null,
    },
    defaultItem: {
      title: null,
      image: null,
      description: null,
    },

    content_url: null,

    dialogData: {
      open: false,
      color: "info",
      bodyText: "test",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "اضافة عنصر جديد" : "تعديل العنصر";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    async initialize() {
      this.api_data.loading = true;

      if (!this.search_value) {
        this.search_value = "";
      }
      console.log("this.table.page", this.table.page);
      const response = await get_ads_service({
        page: this.table.page,
        limit: 10,
        search: this.search_value,
      });

      if (response.status === 500) {
        this.api_data.loading = false;
        this.showDialogFunction(response.data.results, "#FF5252");
      } else {
        this.api_data.loading = false;
        this.api_data.data = response.results.data;
        this.api_data.total = response.results.count;
        this.content_url = response.content_url;
      }
    },

    editItem(item) {
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.data.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    showDialogFunction(bodyText, color) {
      this.dialogData.open = true;
      this.dialogData.bodyText = bodyText;
      this.dialogData.color = color;
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.data[this.editedIndex], this.editedItem);
      } else {
        this.data.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>
<style lang="scss" scoped>
* {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}
</style>
