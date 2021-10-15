<template>
  <v-card elevation="1" class="px-4" outlined>
    <v-data-table
      :headers="headers"
      :items="list"
      :search="search"
      item-key="ID"
      fixed-header
      hide-default-footer
      dense
      :page.sync="page"
      :items-per-page="50"
      @page-count="pageCount = $event"
      :loading="loading"
      loading-text="読み込み中.....少々お待ちください。"
      no-data-text="データがありません。"
    >
      <!-- Search Form -->
      <template v-slot:top>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="フリーワード検索"
          class="my-3"
        ></v-text-field>
      </template>
      <!-- Custom Cols -->
      <!-- 概要 -->
      <template v-slot:[`item.summary`]="{ item }">
        <div class="my-3">
          <div class="mb-1">
            <span class="font-weight-bold ml-1">{{ item['概要'] }}</span>
          </div>
          <div class="mb-1">
            種類:
            <span class="font-weight-bold ml-1">{{ item['種別'] }}</span>
          </div>
          <div class="mb-1">
            取得方法:
            <span class="font-weight-bold ml-1">{{ item['取得方法'] }}</span>
          </div>
          <div v-if="!!item.benefits" class="mb-1">
            特典内容:
            <v-chip
              small
              color="success"
              v-for="(benefit, k) in item.benefits"
              :key="k"
              class="ml-1"
            >
              {{ benefit }}
            </v-chip>
          </div>
          <div v-if="!!item['使用条件1']" class="mb-1">
            使用条件:
            <v-chip v-for="(i, k) in item.conditions" :key="k" small color="primary" class="ml-1">{{
              i
            }}</v-chip>
          </div>
          <div v-if="!!item['使用条件2']">
            特記事項:
            <span class="font-weight-bold">{{ item['使用条件2'] }}</span>
          </div>

          <div v-if="item.ref.length > 0">
            資料:
            <span v-for="(i, idx) in item.ref" :key="idx" class="ml-3">
              <a :href="item.ref[idx + 1]" target="_blank" v-if="idx % 2 == 0">{{
                item.ref[idx]
              }}</a>
            </span>
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
    </v-data-table>
    <v-card-actions>
      <v-pagination v-model="page" :length="20"></v-pagination>
    </v-card-actions>
  </v-card>
</template>
<script>
import editor from '@/components/admin/edit.vue';

export default {
  props: { campaignList: Array, loading: Boolean, adminMode: Boolean },
  components: {
    editor,
  },
  data: function() {
    return {
      list: [],
      page: 1,
      pageCount: 0,
      search: '',
      headers: [
        //{ text: '', value: 'isExpired', sortable: false },
        //{ text: '詳細', value: 'data-table-expand' },
        { text: '概要', value: 'summary', sortable: false },
        { text: 'コード', value: 'コード', sortable: false },
        { text: '開始日', value: '開始日' },
        { text: '終了日', value: '終了日' },
      ],
      expanded: [],
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
      let list = this.campaignList.map((val, idx) => {
        //format date
        val['終了日'] = this.$moment(val['終了日']).format('YYYY-MM-DD');
        // If the campaign period has already expired, flag it.
        val.isExpired = this.validDate(val['終了日']);
        val['終了日'] = String(val['終了日']).replace(/-/g, '/');
        //プロパティ名に日本語は使えないのでrefプロパティとして入れ替える
        //レコードの中身がカンマとスペースと改行コードなど混合構成されているので、データとして使えるように整形する
        let tmp = String(val['資料']).split(/[,\s\r\n]/g);
        //空文字除去
        val.ref = tmp.filter(val => !!val);
        //特典内容整形
        val.benefits = String(val['特典内容']) == '' ? '' : String(val['特典内容']).split(',');
        //使用条件整形
        val.conditions = String(val['使用条件1']) == '' ? '' : String(val['使用条件1']).split(',');
        //ID付与(for Expand)
        val.ID = idx;

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
      console.log(list);
      //if NOT admin mode
      if (!this.$store.state.adminMode) {
        list = list.filter(val => {
          return val['出力'] == 1 || val['出力'] == true;
        });
      }
      this.list = list;
      this.$emit('loaded');
    },
    reloadList() {
      this.$emit('reloadList');
    },
  },
  watch: {
    campaignList: function() {
      this.rtnList();
    },
  },
};
</script>

<style lang="scss" scoped>
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
</style>
