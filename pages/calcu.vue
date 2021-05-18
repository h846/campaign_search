<template>
  <v-card class="mx-auto" max-width="344">
    <v-card-subtitle>価格上書電卓</v-card-subtitle>

    <v-card-title v-if="discountPrice > 0">
      <span class="text">割引後価格:</span>
      <money class="priceText mx-2" v-model="discountPrice" v-bind="money">{{
        discountPrice
      }}</money>
      <span>円</span>
    </v-card-title>
  </v-card>
</template>
<script>
export default {
  data: function() {
    return {
      discountPrice: 100,
      money: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false
      }
    };
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
