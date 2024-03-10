<template>
  <div>
    <VRow>
      <VCol v-for="(count, name, i) of data" cols="6" sm="4">
        <VCard style="cursor: pointer" class="cardHolder" @click="moveTo(i)">
          <VCardText class="card title" style="font-size: 1.2rem">
            {{ titles[name] }}
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
      paths: [],
      titles: {
        jobs: "الوظائف",
        offers: "العروض",
        packages: "الاشتراكات",
        towers: "الابراج",
        fiber: "الضوئي",
        users: "المستخدمين",
        products: "المنتجات",
        category: "التصنيفات",
        offices: "المكاتب",
        notifications: "الاشعارات",
        postings: "الاعلانات",
      },
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    moveTo(i) {
      this.$router.push({ name: this.paths[i] });
    },
    async getData() {
      const response = await get_analyze_service();

      this.data = response.results;
      this.paths = Object.keys(response.results);
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

    @media (max-width: 600px) {
      font-size: 0.75rem;
    }
  }

  .title {
    @media (max-width: 600px) {
      font-size: 0.75rem !important;
      inline-size: 100% !important;
      text-align: center !important;
    }
  }
}
</style>
