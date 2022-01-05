<template>
  <v-card max-width="350" class="px-2 py-5 mb-5 mx-auto" flat>
    <v-form>
      <v-row>
        <v-col cols="12" class="py-0 mb-5">
          <div class="header-item">
            <p class="main-header">キャンペーン種別</p>
            <span class="sub-header"> キャンペーンの種別を下記から選択してください。 </span>
          </div>
          <v-chip-group v-model="selectTypes" column>
            <v-chip v-for="(i, k) in types" :key="k" :value="i.value" filter outlined>
              {{ i.label }}
            </v-chip>
          </v-chip-group>
          <v-divider class="mt-5"></v-divider>
        </v-col>
        <v-col cols="12" class="py-0 mb-5">
          <div class="header-item">
            <p class="main-header">キャンペーンコード</p>
            <span class="sub-header"> キャンペーンコードを入力してください。 </span>
          </div>
          <v-text-field
            outlined
            v-model="campCode"
            color="success"
            label="キャンペーンコード"
            :hide-details="true"
            dense
          ></v-text-field>
          <v-divider class="mt-5"></v-divider>
        </v-col>
        <v-col cols="12" class="py-0">
          <v-row no-gutters justify="space-between" class="mb-6">
            <v-col cols="12">
              <div class="header-item mb-4">
                <p class="main-header">キャンペーン期間</p>
                <span class="sub-header"> キャンペーンの有効期間を入力してください </span>
              </div>
            </v-col>
            <v-col cols="5">
              <v-menu max-width="300px" min-width="300px" offset-y>
                <!-- ポップアップを追加する要素にv-on="on" -->
                <template v-slot:activator="{ on }">
                  <v-text-field
                    slot="activator"
                    v-model="fromDate"
                    label="開始日"
                    hide-details="auto"
                    readonly
                    v-on="on"
                    class="ma-0 pa-0"
                  />
                </template>
                <!-- ポップアップされる内容-->
                <v-date-picker
                  v-model="fromDate"
                  locale="jp-ja"
                  :day-format="(date) => new Date(date).getDate()"
                  no-title
                />
              </v-menu>
            </v-col>
            <v-col cols="5">
              <v-menu offset-y>
                <!-- ポップアップを追加する要素にv-on="on" -->
                <template v-slot:activator="{ on }">
                  <v-text-field
                    slot="activator"
                    v-model="toDate"
                    label="終了日"
                    readonly
                    hide-details="auto"
                    v-on="on"
                    class="ma-0 pa-0"
                    :disabled="dateDisabled"
                  />
                </template>
                <!-- ポップアップされる内容-->
                <v-date-picker
                  v-model="toDate"
                  locale="jp-ja"
                  :day-format="(date) => new Date(date).getDate()"
                  no-title
                />
              </v-menu>
            </v-col>
            <v-col cols="12">
              <v-checkbox
                v-model="undicided"
                label="期間の指定なし"
                @change="undicidedChecked"
              ></v-checkbox>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="period_note"
                hide-details
                outlined
                dense
                label="期間に関するコメント"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>
<script>
export default {
  data: function () {
    return {
      selectTypes: '',
      types: [
        { label: 'カタログ', value: 'カタログ' },
        { label: 'ニュースレター', value: 'ニュースレター' },
        { label: '荷物同梱', value: '荷物同梱' },
        { label: '雑誌', value: '雑誌' },
        { label: 'WEB', value: 'WEB' },
        { label: 'LINE', value: 'LINE' },
        { label: 'バースデープラス', value: 'birthdayPlus' },
        { label: 'プレミアムプラス', value: 'premiumPlus' },
        { label: 'Facebook', value: 'FACEBOOK' },
        { label: 'FAX', value: 'FAX' },
        { label: 'Instagram', value: 'INSTAGRAM' },
        { label: '新聞', value: 'NP' },
        { label: '新聞広告', value: 'NPAD' },
        { label: '折込チラシ', value: 'NPI' },
        { label: 'テレビ通販', value: 'TV通販' },
        { label: 'X-ing Gate', value: 'XGate' },
        { label: 'お祝い', value: 'お祝い' },
        { label: 'お詫び', value: 'お詫び' },
        { label: 'リサイクル', value: 'リサイクル' },
      ],
      campCode: '',
      fromDate: '',
      toDate: '',
      period_note: '',
      undicided: false,
      dateDisabled: false,
    };
  },
  methods: {
    setCampInfo() {
      let obj = {};
      obj.type = this.selectTypes;
      obj.code = this.campCode;
      obj.startDate = this.fromDate;
      obj.endDate = this.toDate;
      obj.period_note = this.period_note;
      this.$store.commit('setCampInfo', obj);
    },
    undicidedChecked() {
      if (this.undicided) {
        this.dateDisabled = true;
        this.fromDate = null;
        this.toDate = '9000-12-31';
      } else {
        this.dateDisabled = false;
        this.fromDate = this.$moment().format('YYYY-MM-DD');
        this.toDate = this.$moment().format('YYYY-MM-DD');
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.header-item {
  text-align: left;
  border-left: 3px solid #002566;
  padding-left: 5px;
  margin-bottom: 8px;

  .main-header {
    font-size: 1.2rem;
    font-weight: bold;
    padding: 0;
    margin: 0;
  }

  .sub-header {
    margin-top: -3px;
    display: block;
    font-size: 0.8rem;
    color: rgb(100, 100, 100);
  }
}
</style>
