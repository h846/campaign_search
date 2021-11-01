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
          :admin-mode="adminMode"
          :campaign-list="dataList"
          :original-list="originalList"
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
        percentOff: ['5%off', '10%off', '15%off', '20%off', '30%off'],
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
      //console.log(this.originalList);
      //値によって検索方法の振り分け
      let searching = () => {
        //何も指定されていない場合全件表示
        if (searchItem == undefined) {
          return this.originalList;
        }
        // キャンペーン種別だった場合
        else if (isType(searchItem)) {
          return this.originalList.filter(val => {
            return val['種別'] == searchItem;
          });
        }
        //パーセント割引だった場合
        else if (/(\%off)$/i.test(searchItem)) {
          let benefits, conditions;
          //Benefits
          let aryA = this.originalList.filter(val => {
            benefits = val['特典内容'].split(',');
            return benefits.some(elm => {
              return elm.toUpperCase() == searchItem.toUpperCase();
            });
          });
          /*
            以下"使用条件"カラムに特典内容の値が入っているための対応。
            データが整い次第削除
          */
          //Conditions
          let aryB = this.originalList.filter(val => {
            conditions = val['使用条件1'].split(',');
            return conditions.some(elm => {
              return (
                elm.toUpperCase() == searchItem.toUpperCase() ||
                elm.toUpperCase() == searchItem.toUpperCase() + '0' //5%OFF0と登録されているものがあるため。
              );
            });
          });
          //AとBを合わせた結果を返す
          return [...aryA, ...aryB];
        }
        //金額割引だった場合
        else if (/(円off)$/i.test(searchItem)) {
          let item = searchItem.replace(',', '');
          let benefits, conditions;
          //Benefits
          let aryA = this.originalList.filter(val => {
            benefits = val['特典内容'].split(',');
            return benefits.some(elm => {
              return elm.toUpperCase() == item.toUpperCase();
            });
          });
          /*
            以下"使用条件"カラムに特典内容の値が入っているための対応。
            データが整い次第削除
          */
          //Conditions
          let aryB = this.originalList.filter(val => {
            conditions = val['使用条件1'].split(',');
            return conditions.some(elm => {
              return elm.toUpperCase() == item.toUpperCase();
            });
          });
          //AとBを合わせた結果を返す
          return [...aryA, ...aryB];
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
