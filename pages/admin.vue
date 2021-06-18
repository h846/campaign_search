<template>
  <v-row no-gutters justify="center" class="mt-8">
    <v-col cols="6">
      <v-card max-width="374" class="pa-2" outlined>
        <v-card-title>キャンペーン追加</v-card-title>
        <v-form>
          <v-container>
            <v-row>
              <v-col>
                <v-select
                  v-model="selectTypes"
                  :items="types"
                  item-text="label"
                  item-value="value"
                  label="種別"
                  return-object
                  single-line
                  hint="キャンペーンの種別を選択してください"
                  persistent-hint
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col> </v-col>
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
      ]
    };
  }
};
</script>
