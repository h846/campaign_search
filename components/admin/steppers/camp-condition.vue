<template>
  <v-card max-width="350" class="px-2 py-5 mb-5 mx-auto" flat>
    <v-form>
      <v-row>
        <!--        特典内容         -->
        <v-col cols="12" class="py-0">
          <div class="header-item">
            <p class="main-header">特典内容</p>
            <span class="sub-header">
              特典内容を選択してください
            </span>
          </div>
          <v-select
            v-model="slctdBnfts"
            outlined
            multiple
            label="特典内容"
            :items="benefits"
            :clearable="true"
            :hide-details="true"
          >
          </v-select>
          <v-divider class="my-3"></v-divider>
        </v-col>
        <!--        使用条件         -->
        <v-col cols="12" class="py-0">
          <div class="header-item my-2">
            <p class="main-header">使用条件</p>
            <span class="sub-header">
              使用条件を選択してください
            </span>
          </div>
          <v-select
            v-model="slctdConds"
            outlined
            multiple
            label="使用条件1"
            :items="conditions"
            :clearable="true"
            :hide-details="true"
          >
          </v-select>

          <v-divider class="my-3"></v-divider>
        </v-col>
        <!-- 使用条件2 -->
        <v-col>
          <div class="header-item">
            <p class="main-header">特記事項</p>
            <span class="sub-header">
              特記事項があれば入力してください。
            </span>
          </div>

          <v-text-field
            outlined
            v-model="remarks"
            color="success"
            label="特記事項"
            hide-details="auto"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>
<script>
import { required, url, minLength } from 'vuelidate/lib/validators';

export default {
  data: function() {
    return {
      slctdBnfts: [],
      slctdConds: [],
      benefits: [
        '送料無料',
        '500円OFF',
        '1000円OFF',
        '2000円OFF',
        '2500円OFF',
        '3000円OFF',
        '4000円OFF',
        '5000円OFF',
        '5%OFF',
        '10%OFF',
        '15%OFF',
        '20%OFF',
        '25%OFF',
        '30%OFF',
        '35%OFF',
        '40%OFF',
        '裾上げ無料',
      ],
      conditions: [
        'クーポン金額以上',
        '【含まない】加工送料',
        '電話OK',
        'Sale楽替可否不要',
        'Sale【 NG 】',
        'Sale【 OK 】',
        '楽替からNG',
        '楽替からOK',
        '1回のみ',
        '初回のみ',
        '2回目のみ',
        'レディスのみ',
        'メンズのみ',
        'お友達紹介',
        'WEB専用',
        'セールONLY',
        '〒郵送',
        '対象商品',
        '楽天市場専用',
        '１点のみ',
        '1月まで購入分',
        '2月まで購入分',
        '3月まで購入分',
        '4月まで購入分',
        '5月まで購入分',
        '6月まで購入分',
        '7月まで購入分',
        '8月まで購入分',
        '9月まで購入分',
        '10月まで購入分',
        '11月まで購入分',
        '12月まで購入分',
        'X-ing Cat.12',
        'X-ing Cat.17',
        'X-ing Cat.53',
        'X-ing 対象購入',
        'X-ing 対象商品',
        '2000円以上',
        '3000円以上',
        '4000円以上',
        '5000円以上',
        '7000円以上',
        '7500円以上',
        '8000円以上',
        '10000円以上',
        '12000円以上',
        '15000円以上',
        '20000円以上',
      ],
      remarks: '',
    };
  },
  methods: {
    setConditions() {
      let obj = {};
      obj.benefits = this.slctdBnfts;
      obj.conditions = this.slctdConds;
      obj.remarks = this.remarks;
      this.$store.commit('setConditions', obj);
      this.$emit('proceed-regist');
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
