<template>
  <!--- Dialog for show info to user-->
  <v-dialog v-model="dialogData.open" max-width="500px">
    <v-toolbar :color="dialogData.color" dense></v-toolbar>
    <v-card style="border-radius: 0">
      <v-card-title class="headline justify-center">
        {{ dialogData.bodyText }}
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="dialogData.open = false">
          تم
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialogData: Object,
  },

  methods: {
    showDialogFunction(bodyText, color) {
      this.dialogData.open = true;
      this.dialogData.bodyText = bodyText;
      this.dialogData.color = color;
    },
  },
};
</script>
