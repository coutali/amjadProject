<template>
  <div>
    <VRow>
      <VCol v-for="(count, name, i) of data" cols="4">
        <VCard style="cursor: pointer" class="cardHolder" @click="moveTo(i)">
          <VCardText class="card" style="font-size: 1.2rem">
            {{ titles[i] }}
          </VCardText>
          <VCardText class="card">
            {{ count }}
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<script>
import { get_analyze_service } from "@/services/landing";

export default defineComponent({
  data() {
    return {
      data: [],
      titles: [
        "الأعلانات",
        "الوضائف",
        "العروض",
        "الأشتراكات",
        "الأبراج",
        "الضوئي",
        "المستخدمين",
        "المنتجات",
        "تصنيف المنتجات",
        "المكاتب",
      ],
      paths: [],
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      const response = await get_analyze_service();

      this.data = response.results;
      this.paths = Object.keys(response.results);
    },
    moveTo(i) {
      this.paths[i] === "jobs"
        ? this.$router.replace({ name: "Jobs" })
        : this.paths[i] === "products_category"
        ? this.$router.replace({ name: "category" })
        : this.$router.replace({ name: this.paths[i] });
    },
  },
});
</script>

<style lang="scss" scoped>
.cardHolder {
  transition: 1s scale;

  &:hover {
    scale: 1.03;
  }

  .card {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
  }
}
</style>
