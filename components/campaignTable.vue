<template>
  <v-card elevation="10" class="pa-10">
    <v-data-table :headers="headers" :items="rtnList()" :search="search" dense>
      <template v-slot:top>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="フリーワード検索"
          class="mb-2"
        ></v-text-field>
      </template>
      <!-- 資料カラムをリンク化-->
      <template v-slot:item.ref="{ item }">
        <div
          v-for="(i, idx) in item.ref"
          :key="idx"
          class="mb-3"
          style="width:100px;"
        >
          <a :href="item.ref[idx + 1]" v-if="idx % 2 == 0">
            {{ item.ref[idx] }}
          </a>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
export default {
  props: { campaignList: Array },
  data: function() {
    return {
      search: "",
      headers: [
        { text: "種別", value: "種別" },
        { text: "コード", value: "コード" },
        { text: "資料", value: "ref" },
        { text: "開始日", value: "開始日" },
        { text: "終了日", value: "終了日" },
        { text: "概要", value: "概要" },
        { text: "取得方法", value: "取得方法" },
        { text: "送料", value: "特典内容" },
        { text: "詳細1", value: "使用条件1" },
        { text: "詳細2", value: "使用条件2" }
      ]
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
      let list = this.campaignList.map(val => {
        //format date
        val["終了日"] = this.$moment(val["終了日"]).format("YYYY-MM-DD");
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
      return list;
    }
  },
  created() {
    let list = this.rtnList();

    console.log(list);
  }
};
</script>
<style lang="scss" scoped>
.gray {
  background-color: #888;
}
</style>
