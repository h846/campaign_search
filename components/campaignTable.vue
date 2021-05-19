<template>
  <v-simple-table fixed-header>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left" v-for="(header, i) in headers" :key="i">
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, i) in rtnList()"
          :key="i"
          :class="{ gray: item['isExpired'] }"
        >
          <td>{{ item["種別"] }}</td>
          <td>{{ item["コード"] }}</td>
          <!--なおす-->
          <td>{{ item["コード"] }}</td>
          <td>{{ item["開始日"] }}</td>
          <td>{{ item["終了日"] }}</td>
          <td>{{ item["概要"] }} {{ item["取得方法"] }}</td>
          <td>{{ item["特典内容"] }}</td>
          <td>{{ item["使用条件1"] }}</td>
          <td>{{ item["使用条件2"] }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>
<script>
export default {
  props: { campaignList: Array },
  data: function() {
    return {
      headers: [
        "種類",
        "コード",
        "資料",
        "開始日",
        "終了日",
        "概要・取得方法",
        "送料",
        "詳細1",
        "詳細2"
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
      let list = this.campaignList.map(val => {
        if (this.validDate(val["終了日"])) {
          val["isExpired"] = true;
          return val;
        } else {
          val["isExpired"] = false;
          return val;
        }
      });
      return list;
    }
  },
  created() {
    let list = this.rtnList();

    console.log("THIS IS " + list[0].isExpired);
  }
};
</script>
<style lang="scss" scoped>
.gray {
  background-color: #ccc;
}
</style>
