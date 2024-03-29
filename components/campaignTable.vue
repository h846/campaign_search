<template>
  <v-card elevation="1" class="px-4" outlined>
    <v-data-table
      :headers="headers"
      :items="list"
      :search="search"
      item-key="ID"
      :fixed-header="true"
      dense
      :loading="loading"
      :items-per-page="20"
      :footer-props="{
        'items-per-page-text': '行/ページ:',
        'items-per-page-options': [10, 20, 30, 40, 50],
      }"
      loading-text="読み込み中.....少々お待ちください。"
      no-data-text="データがありません。"
      :item-class="itemRowBackground"
    >
      <!-- 列のカスタム-->
      <!-- 種類カラム -->
      <template v-slot:[`item.TYPE`]="{ item }">
        <v-chip :color="typeColor[item.TYPE]" dark>{{ item.TYPE }}</v-chip>
      </template>
      <!-- コードカラム -->
      <template v-slot:[`item.CODE`]="{ item }">
        <div style="font-size: 16px">{{ item.CODE }}</div>
      </template>
      <!-- 資料カラム-->
      <template v-slot:[`item.REFS`]="{ item }">
        <div v-if="item.REFS.length > 0">
          <div v-for="(i, idx) in item.REFS" :key="idx" class="mb-3" style="max-width: 150px">
            <a :href="item.REFS[idx + 1]" target="_blank" v-if="idx % 2 == 0">{{
              item.REFS[idx]
            }}</a>
          </div>
        </div>
      </template>
      <!-- 開始日カラム-->
      <template v-slot:[`item.START_DATE`]="{ item }">
        <div v-if="!!item.START_DATE">{{ item.START_DATE }}</div>
        <div class="mt-3" v-if="!!item.PERIOD_NOTE">{{ item.PERIOD_NOTE }}</div>
      </template>
      <!-- 概要カラム -->
      <template v-slot:[`item.SUMMARY`]="{ item }">
        <div class="my-3">
          <!-- 概要 -->
          <div class="mb-2" v-if="!!item.SUMMARY">
            <div class="mt-n1">【 {{ item.SUMMARY }} 】</div>
          </div>
          <!-- 取得方法 -->
          <div class="mb-2" v-if="!!item.GET_METHOD" style="white-space: pre-wrap">
            <div class="mt-n1">{{ item.GET_METHOD }}</div>
          </div>
        </div>
      </template>

      <!-- 送料無料カラム-->
      <template v-slot:[`item.isFreeShipping`]="{ item }">
        <v-chip v-if="item.isFreeShipping" small color="pink" dark> 送料無料</v-chip>
      </template>
      <!-- 詳細カラム-->
      <template v-slot:[`item.details`]="{ item }">
        <span v-for="(i, k) in item.details" :key="k">
          <v-chip v-if="i != '送料無料'" small color="primary" class="ma-1">
            {{ i }}
          </v-chip>
        </span>
        <!-- 特記事項 -->
        <div v-if="!!item.USE_CONDITION2">
          <div class="pink--text text--accesnt-1 mt-n1">
            {{ item.USE_CONDITION2 }}
          </div>
        </div>
      </template>
      <!-- 管理者カラム -->
      <template v-slot:[`item.admin`]="{ item }">
        <!-- 管理者モード時 編集 削除 ボタン -->
        <editor
          :list="list"
          :itemid="item.ID"
          v-if="adminMode == true"
          class="mt-5"
          @reloadList="reloadList"
        />
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
import editor from '@/components/admin/edit.vue';

export default {
  props: {
    campaignList: Array,
    dispExpired: Boolean,
    dispHiddenItem: Boolean,
    loading: Boolean,
    adminMode: Boolean,
  },
  components: {
    editor,
  },
  data: function () {
    return {
      list: [],
      search: '',
      headers: [
        { text: '種類', value: 'TYPE' },
        { text: 'コード', value: 'CODE', width: '150' },
        { text: '資料', value: 'REFS', sortable: false, width: '150' },
        { text: '開始日', value: 'START_DATE' },
        { text: '終了日', value: 'END_DATE' },
        { text: '概要', value: 'SUMMARY', sortable: false, width: '300' },
        { text: '送料無料', value: 'isFreeShipping', width: '50' },
        { text: '詳細', value: 'details' },
      ],
      typeColor: {
        カタログ: 'indigo darken-4',
        荷物同梱: 'blue lighten-2',
        premiumPlus: 'deep-purple lighten-2',
        birthdayPlus: 'red accent-2',
        ニュースレター: 'blue darken-3',
        WEB: 'blue accent-2',
        LINE: 'green darken-1',
        XGate: 'yellow darken-2',
        お詫び: 'light-green darken-1',
        リサイクル: 'teal accent-3',
        お祝い: 'pink accent-2',
        NPAD: 'green accent-3',
        雑誌: 'teal accent-4',
        NPI: 'light-green accent-3',
        FAX: 'amber darken-3',
        送料無料: 'indigo darken-1',
      },
    };
  },
  created() {
    if (this.$store.state.adminMode) {
      //管理者モードだったらテーブルに"管理"列を追加
      this.headers.push({ text: '管理', value: 'admin' });
    }
  },
  methods: {
    rtnList: function () {
      // リストのディープコピー
      let campList = JSON.parse(JSON.stringify(this.campaignList));
      console.log(campList);
      // リスト整形処理
      let list = campList.map((val) => {
        // 期限切れフラグ
        let now = this.$moment().format('YYYY-MM-DD');
        val.isExpired = this.$moment(val.END_DATE).isBefore(now);
        // 送料無料フラグ
        val.isFreeShipping = val.BENEFITS.some((val) => val == '送料無料') ? true : false;
        if (val.isFreeShipping) {
          //val.BENEFITS = val.BENEFITS.filter((val) => val != '送料無料');
        }
        // 日付のフォーマット
        val.START_DATE = this.$moment(val.START_DATE).format('YYYY/MM/DD');
        val.END_DATE = this.$moment(val.END_DATE).format('YYYY/MM/DD');
        // 詳細カラム(特典内容と使用条件の内容を合体したもの。結局これにまとめて表示するそう。。。)
        val.details = [...val.BENEFITS, ...val.USE_CONDITION1];

        return val;
      });

      //ユーザーモード時は表示フラグがあるもののみ表示する
      if (!this.$store.state.adminMode) {
        list = list.filter((v) => {
          return v.OUTPUT == '1';
        });
      } else {
        // 管理者モードが真、かつ隠しキャンペーンのみ表示が真の場合
        // 隠しキャンペーン"のみ"を表示。
        if (this.dispHiddenItem) {
          list = list.filter((v) => {
            return v.OUTPUT != '1';
          });
          console.log('works');
        }
      }
      // リストの並びを調整
      //　期限切れとそうでないものでリストを分ける
      let invalidList = list.filter((val) => {
        return val.isExpired == true;
      });
      let validList = list.filter((val) => {
        return val.isExpired == false;
      });
      //それぞれのリストを日付降順でソート
      invalidList = invalidList.sort((a, b) => {
        if (a.START_DATE > b.START_DATE) {
          return -1;
        } else {
          return 1;
        }
      });
      validList = validList.sort((a, b) => {
        if (a.START_DATE > b.START_DATE) {
          return -1;
        } else {
          return 1;
        }
      });
      //リストを結合
      list = [...validList, ...invalidList];

      // 期限切れを表示するか
      if (this.dispExpired) {
        list = list.filter((val) => {
          return val.isExpired == false;
        });
      }

      this.list = list;
      //console.log(list);
      this.$emit('loaded');
    },
    reloadList() {
      this.$emit('reloadList');
    },
    itemRowBackground(item) {
      if (item.isExpired) {
        return 'expired';
      } else {
        return 'hovering';
      }
    },
  },
  watch: {
    campaignList: function () {
      this.rtnList();
    },
    dispExpired: function () {
      if (this.dispExpired) {
        this.list = this.list.filter((val) => {
          return val.isExpired == false;
        });
      } else {
        this.rtnList();
      }
    },
  },
};
</script>

<style lang="scss">
.heading {
  font-size: 20px;
  border-left: 5px solid #002566;
  padding-left: 5px;
}

tbody {
  .expired {
    background-color: #ccc !important;
  }
  .hovering {
    //Don't overwrite color when hovering over a row
    background-color: transparent !important;
  }
}

td {
  border-bottom: 2.5px solid #000 !important;
}
</style>
