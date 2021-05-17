<template>
  <v-row justify="center" align="center">
    <v-col cols="12" lg="4">
      <v-sheet width="400" class="mx-auto my-6">
        <v-text-field
          v-model="searchMsg"
          label="フリーワード検索"
          outlined
          clearable
          prepend-inner-icon="mdi-magnify"
        ></v-text-field>
      </v-sheet>
    </v-col>
    <v-col cols="12" lg="8">
      <h1>TABLE is here</h1>
    </v-col>
  </v-row>
</template>

<script>
export default {
  components: {},
  data: function() {
    return {
      searchMsg: "",
      searchItems: {
        campaignType: [
          "カタログ ",
          "荷物同梱",
          "PREMIUM PLUS",
          "BIRTH DAY PLUS",
          "ニュースレター",
          "WEB",
          "LINE",
          "X-ing Gate",
          "お詫び",
          "リサイクル",
          "お祝いクーポン",
          "新聞",
          "雑誌",
          "他社同梱",
          "FAX会員",
          "送料無料"
        ],
        percentOff: ["5%OFF", "10%OFF", "15%OFF", "20%OFF", "30%OFF"],
        priceOff: [
          "500円OFF",
          "1,000円OFF",
          "2,000円OFF",
          "3,000円OFF",
          "5,000円OFF"
        ]
      }
    };
  }
};
</script>
