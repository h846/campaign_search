<template>
  <v-card elevation="1" class="px-4" outlined>
    <v-data-table
      :headers="headers"
      :items="rtnList()"
      :search="search"
      :expanded.sync="expanded"
      item-key="ID"
      show-expand
      hide-default-footer
      dense
      :page.sync="page"
      :items-per-page="10"
      @page-count="pageCount = $event"
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
      <!-- Custom Col -->
      <template v-slot:item.ref="{ item }">
        <div v-for="(i, idx) in item.ref" :key="idx">
          <a :href="item.ref[idx + 1]" target="_blank" v-if="idx % 2 == 0">{{
            item.ref[idx]
          }}</a>
        </div>
      </template>
      <template v-slot:item.isExpired="{ item }">
        <v-chip
          v-if="item.isExpired"
          class="my-2"
          small
          color="red"
          text-color="white"
          >期限切れ</v-chip
        >
      </template>
      <!-- Expand -->
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length" class="pa-5 ">
          <div>
            取得方法:
            <span class="font-weight-bold">{{ item["取得方法"] }}</span>
          </div>
          <div v-if="!!item['特典内容']" class="red--text text--lighten-1">
            送料無料
          </div>
          <div v-if="!!item['使用条件1']">
            使用条件1:
            <span class="font-weight-bold">{{ item["使用条件1"] }}</span>
          </div>
          <div v-if="!!item['使用条件2']">
            使用条件2:
            <span class="font-weight-bold">{{ item["使用条件2"] }}</span>
          </div>
        </td>
      </template>
    </v-data-table>
    <v-card-actions>
      <v-pagination v-model="page" :length="20"></v-pagination>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  props: { campaignList: Array },
  data: function() {
    return {
      page: 1,
      pageCount: 0,
      search: "",
      headers: [
        { text: "", value: "isExpired", sortable: false },
        { text: "詳細", value: "data-table-expand" },
        { text: "概要", value: "概要", sortable: false },
        { text: "種類", value: "種別", sortable: false },
        { text: "コード", value: "コード", sortable: false },
        { text: "資料", value: "ref", sortable: false },
        { text: "開始日", value: "開始日" },
        { text: "終了日", value: "終了日" }
        /*
        { text: "資料", value: "ref", sortable: false },
        { text: "取得方法", value: "取得方法", sortable: false },
        { text: "送料", value: "特典内容", sortable: false },
        { text: "詳細1", value: "使用条件1", sortable: false },
        { text: "詳細2", value: "使用条件2", sortable: false },
        */
      ],
      expanded: []
    };
  },
  methods: {
    validDate: function(arg) {
      let now = this.$moment();
      let endDate = this.$moment(arg);
      return endDate.isBefore(now);
    },
    rtnList: function() {
      //リスト整形処理
      let list = this.campaignList.map((val, idx) => {
        //format date
        val["終了日"] = this.$moment(val["終了日"]).format("YYYY/MM/DD");
        // If the campaign period has already expired, flag it.
        if (this.validDate(val["終了日"])) {
          val["isExpired"] = true;
        } else {
          val["isExpired"] = false;
        }
        //レコードの中身がカンマとスペースと改行コードなど混合構成されているので、データとして使えるように整形する
        //カンマ、改行コード、スペースを除去して切り分ける
        //プロパティ名に日本語は使えないのでrefプロパティとして入れ替える
        let tmp = String(val["資料"]).split(/[,\s\r\n]/g);
        //空文字除去
        tmp = tmp.filter(val => !!val);
        val.ref = tmp;
        //ID付与
        val.ID = idx;

        return val;
      });

      // Sort by date
      list = list.sort((a, b) => {
        if (a["終了日"] > b["終了日"]) {
          return -1;
        } else {
          return 1;
        }
      });

      console.log(list);
      return list;
    }
  }
};
</script>

<style lang="scss" scoped>
.v-text-field {
  width: 400px;
  margin: 0 0 0 auto;
}
</style>
