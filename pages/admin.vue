<template>
  <v-row no-gutters justify="center" class="mt-8">
    <v-col align="center">
      <v-card max-width="400" class="pa-2" outlined>
        <v-card-title>キャンペーン追加</v-card-title>
        <v-form>
          <v-container>
            <v-row>
              <v-col sm="6" cols="12">
                <v-select
                  outlined
                  color="success"
                  v-model="selectTypes"
                  :items="types"
                  item-text="label"
                  item-value="value"
                  label="種別"
                  return-object
                  single-line
                  hint="キャンペーンの種別を選択してください"
                  persistent-hint
                  dense
                ></v-select>
              </v-col>
              <v-col sm="6" cols="12">
                <v-text-field
                  outlined
                  v-model="campCode"
                  color="success"
                  label="キャンペーンコード"
                  :rules="rules.code"
                  required
                  hint="キャンペーンコードを入力してください"
                  persistent-hint
                  dense
                ></v-text-field>
              </v-col>
            </v-row>
            <p class="ma-0 pa-0 my-5">キャンペーン期間を選択してください</p>
            <v-row justify="center" align="center">
              <v-col cols="5">
                <v-menu max-width="290px" min-width="290px" offset-y>
                  <!-- ポップアップを追加する要素にv-on="on" -->
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      slot="activator"
                      v-model="fromDate"
                      label="開始日"
                      readonly
                      v-on="on"
                    />
                  </template>
                  <!-- ポップアップされる内容-->
                  <v-date-picker
                    v-model="fromDate"
                    locale="jp-ja"
                    :day-format="date => new Date(date).getDate()"
                    no-title
                  />
                </v-menu>
              </v-col>
              <v-col cols="1" class="pa-0"
                ><v-icon large color="blue-grey darken-2"
                  >mdi-arrow-right</v-icon
                ></v-col
              >
              <v-col cols="5">
                <v-menu max-width="290px" min-width="290px" offset-y>
                  <!-- ポップアップを追加する要素にv-on="on" -->
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      slot="activator"
                      v-model="toDate"
                      label="終了日"
                      readonly
                      v-on="on"
                    />
                  </template>
                  <!-- ポップアップされる内容-->
                  <v-date-picker
                    v-model="toDate"
                    locale="jp-ja"
                    :day-format="date => new Date(date).getDate()"
                    no-title
                  />
                </v-menu>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  data: function() {
    return {
      selectTypes: { label: "カタログ", value: "カタログ" },
      types: [
        { label: "カタログ", value: "カタログ" },
        { label: "ニュースレター", value: "ニュースレター" },
        { label: "荷物同梱", value: "荷物同梱" },
        { label: "雑誌", value: "雑誌" },
        { label: "WEB", value: "WEB" },
        { label: "LINE", value: "LINE" },
        { label: "バースデープラス", value: "birthdayPlus" },
        { label: "プレミアムプラス", value: "premiumPlus" },
        { label: "Facebook", value: "FACEBOOK" },
        { label: "FAX", value: "FAX" },
        { label: "Instagram", value: "INSTAGRAM" },
        { label: "新聞", value: "NP" },
        { label: "新聞広告", value: "NPAD" },
        { label: "折込チラシ", value: "NPI" },
        { label: "テレビ通販", value: "TV通販" },
        { label: "X-ing Gate", value: "XGate" },
        { label: "お祝い", value: "お祝い" },
        { label: "お詫び", value: "お詫び" },
        { label: "リサイクル", value: "リサイクル" }
      ],
      campCode: "",
      fromDate: "",
      toDate: "",

      rules: {
        code: [val => (val.length > 0 ? val : "入力必須項目です")]
      }
    };
  },
  computed: {}
};
</script>
