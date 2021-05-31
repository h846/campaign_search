<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <v-chip-group v-model="itemType" column>
        <v-chip
          v-for="(item, i) in searchItems.campaignType"
          :key="i"
          :value="item"
          filter
          outlined
        >
          {{ item }}
        </v-chip>
      </v-chip-group>
      <v-divider class="ma-2"></v-divider>
      <v-chip-group v-model="itemType" column>
        <v-chip
          v-for="(item, i) in searchItems.priceOff"
          :key="i"
          :value="item"
          filter
          outlined
          >{{ item }}</v-chip
        >
      </v-chip-group>
      <v-divider class="ma-2"></v-divider>
      <v-chip-group v-model="itemType" column>
        <v-chip
          v-for="(item, i) in searchItems.percentOff"
          :key="i"
          :value="item"
          filter
          outlined
          >{{ item }}</v-chip
        >
      </v-chip-group>
    </v-col>
    <v-col cols="12">
      <campaign-table :campaign-list="dataList" />
    </v-col>
  </v-row>
</template>

<script>
import axios from "axios";
import CampaignTable from "~/components/campaignTable.vue";

export default {
  components: {
    CampaignTable
  },
  data: function() {
    return {
      itemType: "",
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
      },
      dataList: []
    };
  },
  mounted() {
    this.getCampaignData();
  },
  methods: {
    getCampaignData: async function() {
      await axios
        .get("http://lejnet/API/accdb", {
          params: {
            db: "CSNet/dataCenter/DB/Product/campaign.accdb",
            table: "campaign_data00_test"
          }
        })
        .then(res => {
          this.dataList = res.data;
        });
    }
  },
  computed: {
    now: function() {
      return this.$moment().format("YYYY/MM/DD");
    }
  }
};
</script>
