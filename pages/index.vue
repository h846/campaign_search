<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <v-chip-group v-model="searchItem" column>
        <v-chip
          v-for="(item, name, idx) in searchItems.campaignType"
          :key="idx"
          :value="item"
          filter
          outlined
        >
          {{ name }}
        </v-chip>
      </v-chip-group>
      <v-divider class="ma-2"></v-divider>
      <v-chip-group v-model="searchItem" column>
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
      <v-chip-group v-model="searchItem" column>
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
      <campaign-table
        :campaign-list="dataList"
        :loading="loading"
        @loaded="loaded"
      />
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
      searchItem: "",
      searchItems: {
        campaignType: {
          //テーブル列名:DB上の列名
          "カタログ ": "カタログ",
          荷物同梱: "荷物同梱",
          "PREMIUM PLUS": "premiumPlus",
          "BIRTH DAY PLUS": "birthdayPlus",
          ニュースレター: "ニュースレター",
          WEB: "WEB",
          LINE: "LINE",
          "X-ing Gate": "XGate",
          お詫び: "お詫び",
          リサイクル: "リサイクル",
          お祝いクーポン: "お祝い",
          新聞: "NPAD",
          雑誌: "雑誌",
          他社同梱: "NPI",
          FAX会員: "FAX",
          送料無料: "送料無料"
        },
        percentOff: ["5%off", "10%off", "15%off", "20%off", "30%off"],
        priceOff: [
          "500円off",
          "1000円off",
          "2000円off",
          "3000円off",
          "5000円off"
        ]
      },
      originalList: [],
      dataList: [],
      loading: false
    };
  },
  created() {
    this.getCampaignData();
  },
  methods: {
    getCampaignData: async function() {
      this.loading = true;
      await axios
        .get("http://lejnet/API/accdb", {
          params: {
            db: "CSNet/dataCenter/DB/Product/campaign.accdb",
            table: "campaign_data00_test"
          }
        })
        .then(res => {
          this.originalList = res.data;
          this.dataList = res.data;
          //console.log(this.originalList);
        });
    },
    search: function() {
      let item = this.searchItem;
      let reg = /off$/;

      if (item == undefined) {
        this.dataList = this.originalList;
      } else if (item == "送料無料") {
        this.dataList = this.originalList.filter(
          val => val["特典内容"] === "送料無料"
        );
      } else if (reg.test(item)) {
        this.dataList = this.originalList.filter(val =>
          val.conditions.some(val => val == item)
        );
      } else {
        this.dataList = this.originalList.filter(val => val["種別"] === item);
      }
    },
    loaded: function() {
      this.loading = false;
    }
  },
  watch: {
    // v-model の値が遅延して反映されるため
    searchItem: function() {
      this.search();
    }
  }
};
</script>
