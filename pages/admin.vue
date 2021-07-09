<template>
  <v-row no-gutters justify="center" class="mt-8">
    <v-col align="center">
      <v-card max-width="400" class="pa-2" outlined>
        <v-card-title>キャンペーン追加</v-card-title>
        <v-form>
          <v-container>
            <v-row>
              <v-col cols="12" class="py-0 mb-3">
                <div class="item-header">
                  キャンペーン種別
                  <span class="sub-header">
                    キャンペーンの種別を一覧から選択してください。
                  </span>
                </div>
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
                  persistent-hint
                  dense
                  :hide-details="true"
                ></v-select>
              </v-col>
              <v-col cols="12" class="py-0 mb-3">
                <div class="item-header">
                  キャンペーンコード
                  <span class="sub-header">
                    キャンペーンコードを入力してください。
                  </span>
                </div>
                <v-text-field
                  outlined
                  v-model="$v.campCode.$model"
                  color="success"
                  label="キャンペーンコード"
                  :hide-details="true"
                  dense
                ></v-text-field>
                <div
                  class="text-left red--text my-0 py-0"
                  v-if="$v.campCode.$error"
                >
                  性別を選択してください。
                </div>
              </v-col>
              <v-col cols="12" class="py-0">
                <div class="item-header">
                  キャンペーン期間
                  <span class="sub-header">
                    キャンペーンの有効期間を入力してください
                  </span>
                </div>
              </v-col>
              <v-col cols="6" class="py-0">
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
              <v-col cols="6" class="py-0">
                <v-menu offset-y>
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
              <v-col cols="12" class="py-0">
                <div class="item-header">
                  資料
                  <span class="sub-header">
                    資料がある場合は名前とURLを入力してください
                  </span>
                </div>
              </v-col>
              <v-col cols="12" class="py-0">
                <v-text-field
                  outlined
                  v-model="refName"
                  color="success"
                  label="資料の名前"
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="py-0">
                <v-text-field
                  outlined
                  v-model="refURL"
                  color="success"
                  label="資料のURL"
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-btn color="success" block>
                  SUBMIT
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import { required, url, minLength } from "vuelidate/lib/validators";

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
      refName: "",
      refURL: ""
    };
  },
  validations: {
    campCode: {
      required
    },
    refURL: {
      url
    }
  },
  computed: {}
};
</script>
<style lang="scss" scoped>
.item-header {
  font-size: 1.2rem;
  text-align: left;
  border-left: 6px solid #002566;
  font-weight: bold;
  padding-left: 5px;
  margin-bottom: 10px;
  .sub-header {
    font-weight: 200;
    margin-top: -3px;
    display: block;
    font-size: 0.7rem;
    color: rgb(58, 58, 58);
  }
}
</style>
