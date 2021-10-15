<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="3">
        <v-text-field
          outlined
          v-model="searchFormVal"
          append-icon="mdi-magnify"
          label="フリーワード検索"
          class="my-3"
        ></v-text-field>
      </v-col>
      <v-col cols="9">
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
          :admin-mode="adminMode"
          :campaign-list="dataList"
          :original-list="originalList"
          :loading="loading"
          @loaded="loaded"
          @reloadList="reloadList"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import CampaignTable from '~/components/campaignTable.vue';

export default {
  components: {
    CampaignTable,
  },
  data: function() {
    return {
      searchFormVal: '',
      searchItem: '',
      searchItems: {
        campaignType: {
          //テーブル列名:DB上の列名
          カタログ: 'カタログ',
          荷物同梱: '荷物同梱',
          'PREMIUM PLUS': 'premiumPlus',
          'BIRTH DAY PLUS': 'birthdayPlus',
          ニュースレター: 'ニュースレター',
          WEB: 'WEB',
          LINE: 'LINE',
          'X-ingGate': 'XGate',
          お詫び: 'お詫び',
          リサイクル: 'リサイクル',
          お祝いクーポン: 'お祝い',
          新聞: 'NPAD',
          雑誌: '雑誌',
          他社同梱: 'NPI',
          FAX会員: 'FAX',
          送料無料: '送料無料',
        },
        percentOff: ['5%off', '10%off', '15%off', '20%off', '30%off'],
        priceOff: ['500円off', '1000円off', '2000円off', '3000円off', '5000円off'],
      },
      originalList: [],
      dataList: [],
      loading: false,
      adminMode: false,
    };
  },
  created() {
    this.getCampaignData();
  },
  methods: {
    getCampaignData: async function() {
      this.loading = true;
      await axios
        .get('http://lejnet/API/accdb', {
          params: {
            db: 'CSNet/dataCenter/DB/Product/campaign_test.accdb',
            table: 'campaign_data00_test',
          },
        })
        .then(res => {
          this.originalList = res.data;
          this.dataList = res.data;
        });
    },
    search: function(searchItem) {
      console.log(this.originalList);
      //値によって検索方法の振り分け
      let searching = () => {
        //何も指定されていない場合全件
        if (searchItem == undefined) {
          return this.originalList;
        }
        // キャンペーン種別だった場合
        else if (isType(searchItem)) {
          return this.originalList.filter(val => {
            return val['種別'] == searchItem;
          });
        }
        //金額割引だった場合
        else if(){

        }
        // それ以外。フリーワード検索。
        else {
          return this.originalList.filter(val => {
            for (let key of Object.keys(val)) {
              if (String(val[key]).indexOf(searchItem) !== -1) return true;
            }
          });
        }
      };
      //以下値判別用関数
      //値は種別か
      let isType = item => {
        let types = this.searchItems.campaignType;
        let isExist = false;
        for (let key in types) {
          if (types[key] == item) {
            isExist = true;
          }
        }
        return isExist;
      };
      //値は金額か
      //　ここから


      this.dataList = searching();
    },
    loaded: function() {
      this.loading = false;
    },
    reloadList() {
      this.getCampaignData();
    },
  },
  watch: {
    // v-model の値が遅延して反映されるため
    searchItem: function() {
      this.search(this.searchItem);
    },
    searchFormVal: function() {
      this.search(this.searchFormVal);
    },
  },
  mounted() {
    this.adminMode = this.$store.state.adminMode;
  },
};
</script>
