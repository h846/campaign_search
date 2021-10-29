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
      <!-- 概要 -->
      <template v-slot:[`item.summary`]="{ item }">
        <div class="my-3">
          <div class="mb-2">
            <span class="font-weight-bold ml-1">{{ item['概要'] }}</span>
          </div>
          <div class="mb-2">
            取得方法:
            <span class="font-weight-bold ml-1">{{ item['取得方法'] }}</span>
          </div>
          <div v-if="!!item['使用条件2']">
            特記事項:
            <span class="font-weight-bold">{{ item['使用条件2'] }}</span>
          </div>

          <!-- 管理者モード時 編集 削除 ボタン -->
          <editor
            :list="list"
            :itemid="item['campaign_data_test.ID']"
            v-if="adminMode == true"
            class="mt-5"
            @reloadList="reloadList"
          />
        </div>
      </template>
      <!-- 資料カラム-->
      <template v-slot:[`item.ref`]="{ item }">
        <div v-if="item.ref.length > 0">
          <div v-for="(i, idx) in item.ref" :key="idx" class="mb-3">
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
        { text: '種類', value: '種別', width: '10%' },
        { text: 'コード', value: 'コード', width: '10%' },
        { text: '資料', value: 'ref', sortable: false, width: '20%' },
        { text: '開始日', value: '開始日', width: '5%' },
        { text: '終了日', value: '終了日', width: '5%' },
        { text: '概要', value: 'summary', sortable: false, width: '20%' },
        { text: '送料無料', value: 'isFreeShipping', width: '10%' },
        { text: '詳細', value: 'details', width: '20%' },
      ],
    };
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
        val['終了日'] = this.$moment(val['終了日']).format('YYYY-MM-DD');
        // If the campaign period has already expired, flag it.
        val.isExpired = this.validDate(val['終了日']);
        val['終了日'] = String(val['終了日']).replace(/-/g, '/');
        //プロパティ名に日本語は使えないのでrefプロパティとして入れ替える
        //データの区切り文字がカンマとスペースと改行コードなど混合構成されているので、データとして使えるように整形する
        let tmp = String(val['資料']).split(/[,\s\r\n]/g);
        //空文字除去
        val.ref = tmp.filter(val => !!val);
        //特典内容整形
        val.benefits = String(val['特典内容']) == '' ? '' : String(val['特典内容']).split(',');
        //使用条件整形
        val.conditions = String(val['使用条件1']) == '' ? '' : String(val['使用条件1']).split(',');
        //送料無料？
        if (Array.isArray(val.benefits)) {
          val.isFreeShipping = val.benefits.some(val => val == '送料無料') ? true : false;
          //送料無料列に表示するので削除
          val.benefits = val.benefits.filter(val => val != '送料無料');
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
      //if NOT admin mode
      if (!this.$store.state.adminMode) {
        list = list.filter(val => {
          return val['出力'] == 1 || val['出力'] == true;
        });
      }
      // disp expired campaign?
      if (this.dispExpired) {
        list = list.filter(val => {
          return val.isExpired == false;
        });
      }
      this.list = list;
      // console.log(list);
      this.$emit('loaded');
    },
    reloadList() {
      this.$emit('reloadList');
    },
    itemRowBackground(item) {
      if (item.isExpired) {
        return 'expired';
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

.expired {
  background-color: #ccc;
}

tbody {
  tr:hover {
    background-color: transparent !important;
  }
}
</style>
