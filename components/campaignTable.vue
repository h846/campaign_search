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
      <!-- Custom Cols -->
      <template v-slot:[`item.TYPE`]="{ item }">
        <v-chip :color="typeColor[item.TYPE]" dark>{{ item.TYPE }}</v-chip>
      </template>
      <!-- 概要 -->
      <template v-slot:[`item.SUMMARY`]="{ item }">
        <div class="my-3">
          <div class="mb-2">
            <span class="indigo--text text--darken-4" style="display:inline-block;width:62px;"
              >概要:
            </span>
            <span>{{ item.SUMMARY }}</span>
          </div>
          <div class="mb-2">
            <span class="indigo--text text--darken-4" style="display:inline-block;width:62px;"
              >取得方法:</span
            >
            <span>{{ item.GET_METHOD }}</span>
          </div>
          <div v-if="!!item.USE_CONDITION2">
            <span class="indigo--text text--darken-4" style="display:inline-block;width:62px;"
              >特記事項:</span
            >
            <span class="pink--text text--accesnt-1">
              {{ item.USE_CONDITION2 }}
            </span>
          </div>
        </div>
      </template>
      <!-- 資料カラム-->
      <template v-slot:[`item.ref`]="{ item }">
        <div v-if="item.ref.length > 0">
          <div v-for="(i, idx) in item.ref" :key="idx" class="mb-3 " style="max-width:150px;">
            <a :href="item.ref[idx + 1]" target="_blank" v-if="idx % 2 == 0">{{ item.ref[idx] }}</a>
          </div>
        </div>
      </template>
      <!-- 送料無料カラム-->
      <template v-slot:[`item.isFreeShipping`]="{ item }">
        <v-chip v-if="item.isFreeShipping" small color="pink" dark> 送料無料</v-chip>
      </template>
      <!-- 詳細カラム-->
      <template v-slot:[`item.details`]="{ item }">
        <v-chip v-for="(i, k) in item.details" :key="k" small color="primary" class="ma-1">{{
          i
        }}</v-chip>
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
    originalList: Array,
    dispExpired: Boolean,
    loading: Boolean,
    adminMode: Boolean,
  },
  components: {
    editor,
  },
  data: function() {
    return {
      list: [],
      search: '',
      headers: [
        { text: '種類', value: 'TYPE' },
        { text: 'コード', value: 'CODE' },
        { text: '資料', value: 'ref', sortable: false, width: '20%' },
        { text: '開始日', value: 'START_DATE' },
        { text: '終了日', value: 'END_DATE' },
        { text: '概要', value: 'SUMMARY', sortable: false, width: '30%' },
        { text: '送料無料', value: 'isFreeShipping' },
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
    validDate: function(arg) {
      let now = this.$moment().format('YYYY-MM-DD');
      let endDate = this.$moment(arg);
      return endDate.isBefore(now);
    },
    rtnList: function() {
      //リスト整形処理
      let list = this.campaignList.map(val => {
        //format date
        //val.END_DATE = this.$moment(val.END_DATE).format('YYYY-MM-DD');
        // If the campaign period has already expired, flag it.
        val.isExpired = this.validDate(val.END_DATE);
        val.END_DATE = String(val.END_DATE).replace(/-/g, '/');
        //資料データの区切り文字がカンマとスペースと改行コードなど混合構成されているので、データとして使えるように整形する
        // val.ref = val.REFS.split(',') == 'null' ? '' : val.REFS.split(/[,\r\n|\n]/g);
        val.ref = val.REFS.split(',') == 'null' ? '' : val.REFS.split(',');
        //特典内容整形
        val.benefits =
          String(val.BENEFITS).split(',') == 'null' ? '' : String(val.BENEFITS).split(',');
        //使用条件整形
        val.conditions = val.USE_CONDITION1 == 'null' ? '' : String(val.USE_CONDITION1).split(',');
        //使用条件2 (特記事項)
        if (val.USE_CONDITION2 == 'null') val.USE_CONDITION2 = '';
        //送料無料？
        if (Array.isArray(val.benefits)) {
          val.isFreeShipping = val.benefits.some(val => val == '送料無料') ? true : false;
          //送料無料列に表示するので削除
          // val.benefits = val.benefits.filter(val => val != '送料無料');
        } else {
          val.isFreeShipping = false;
        }

        // 詳細カラム(特典内容と使用条件の内容を合体したもの。結局これにまとめて表示するそう。。。)
        val.details = [...val.benefits, ...val.conditions];

        return val;
      });
      // Sort by date
      list = list.sort((a, b) => {
        if (a['終了日'] > b['終了日']) {
          return -1;
        } else {
          return 1;
        }
      });

      // disp expired campaign?
      if (this.dispExpired) {
        list = list.filter(val => {
          return val.isExpired == false;
        });
      }
      this.list = list;
      console.log(list);
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
    campaignList: function() {
      this.rtnList();
    },
    dispExpired: function() {
      if (this.dispExpired) {
        this.list = this.list.filter(val => {
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
.v-text-field {
  width: 400px;
  margin: 0 0 0 auto;
}

#edit-form {
  width: 300px;
  margin: 0 auto;
  padding: 20px 10px;
}

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
</style>
