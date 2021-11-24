<template>
  <v-container fluid Sfill-height>
    <v-row justify="center" align="center">
      <v-col cols="3">
        <v-text-field
          outlined
          v-model="searchFormVal"
          append-icon="mdi-magnify"
          label="フリーワード検索"
          class="my-3"
          @keydown.enter="search(searchFormVal)"
        ></v-text-field>
        <!-- 期限切れ表示非表示 -->
        <v-switch v-model="dispSwitch" label="期限切れ非表示" :messages="switchMsg"> </v-switch>
      </v-col>
      <v-col cols="9">
        <v-chip-group v-model="searchItem" column>
          <v-chip
            v-for="(item, name, idx) in searchItems.campaignType"
            :key="idx"
            :value="item"
            filter
            :color="chipColors[idx]"
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
            color="cyan darken-1"
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
            color="light-green darken-1"
            outlined
            >{{ item }}</v-chip
          >
        </v-chip-group>
      </v-col>
      <v-col cols="12">
        <campaign-table
          v-show="showTable"
          :admin-mode="adminMode"
          :campaign-list="dataList"
          :loading="loading"
          :dispExpired="dispSwitch"
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
      showTable: false,
      dispSwitch: false,
      switchMsg: 'OFF',
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
        percentOff: ['5%off', '10%off', '15%off', '20%off', '25%off', '30%off', '35%off', '40%off'],
        priceOff: ['500円off', '1,000円off', '2,000円off', '3,000円off', '5,000円off'],
      },
      chipColors: [
        'indigo darken-4',
        'blue lighten-2',
        'deep-purple lighten-2',
        'red accent-2',
        'blue darken-3',
        'blue accent-2',
        'green darken-1',
        'yellow darken-2',
        'light-green darken-1',
        'teal accent-3',
        'pink accent-2',
        'green accent-3',
        'teal accent-4',
        'light-green accent-3',
        'amber darken-3',
        'indigo darken-1',
      ],
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
      await axios.post('http://lejnet/API/oracle/camp_data').then(res => {
        let list = res.data.map(val => {
          // オラクルのnullは文字列となって返ってくる
          for (let key in val) {
            if (val[key] == 'null') {
              if (key == 'BENEFITS' || key == 'USE_CONDITION1' || key == 'REFS') {
                val[key] = [];
              } else {
                val[key] = null;
              }
            } else if (key == 'BENEFITS' || key == 'USE_CONDITION1' || key == 'REFS') {
              val[key] = val[key].split(',');
            }
          }
          return val;
        });
        //ディープコピー
        this.originalList = list.map(val => ({ ...val }));
        this.dataList = list.map(val => ({ ...val }));
        //console.log(this.originalList);
      });
    },
    search: function(searchItem) {
      if (!this.showTable) {
        this.showTable = true;
      }
      //値によって検索方法の振り分け
      let searching = () => {
        //何も指定されていない場合全件表示
        if (searchItem == undefined) {
          return this.originalList;
        }
        // キャンペーン種別だった場合
        else if (isType(searchItem)) {
          return this.originalList.filter(val => {
            return val.TYPE == searchItem;
          });
        }
        //パーセント割引、金額割引だった場合
        else if (/(\%off)$|(円off)$/i.test(searchItem)) {
          //金額の場合カンマを除去
          let item = searchItem.replace(',', '');
          let ary = this.originalList.filter(val => {
            //Benefitsを検索
            let benefits = val.BENEFITS.some(elm => {
              return elm.toUpperCase() == item.toUpperCase();
            });
            //Conditionsを検索(Conditionsにも特典内容が入っているため)
            let conditions = val.USE_CONDITION1.some(elm => {
              return (
                elm.toUpperCase() == item.toUpperCase() ||
                elm.toUpperCase() == item.toUpperCase() + '0'
              );
            });
            return benefits || conditions;
          });

          return ary;
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
            //送料無料というカテゴリはないので、これは除外。
            isExist = item !== '送料無料' ? true : false;
          }
        }
        return isExist;
      };

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
    dispSwitch: function() {
      this.dispSwitch ? (this.switchMsg = 'ON') : (this.switchMsg = 'OFF');
    },
  },
  mounted() {
    this.adminMode = this.$store.state.adminMode;
  },
};
</script>
