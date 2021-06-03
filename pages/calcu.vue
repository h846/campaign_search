<template>
  <v-card class="mx-auto" max-width="344">
    <v-card-subtitle>価格上書電卓</v-card-subtitle>

    <v-card-title v-if="discountPrice > 0">
      <span class="text">割引後価格:</span>
      <span>{{ price }}</span>
      <span>円</span>
    </v-card-title>
  </v-card>
</template>
<script>
export default {
  data: function() {
    return {
      discountPrice: 999999
    };
  },
  computed: {
    price: function() {
      // 円マーク付与と3桁区切り
      let price = this.discountPrice;
      return "\xA5" + price.toLocaleString();
    }
  }
};
</script>
<style lang="scss" scoped>
.text {
  font-size: 1rem;
}

.priceText {
  font-size: 3rem;
}
</style>
