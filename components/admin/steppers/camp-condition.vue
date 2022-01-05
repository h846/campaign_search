<template>
  <v-card max-width="350" class="px-2 py-5 mb-5 mx-auto" flat>
    <v-form v-model="valid" ref="form">
      <v-row>
        <!--        特典内容         -->
        <v-col cols="12" class="py-0 mb-5">
          <div class="header-item">
            <p class="main-header">特典内容</p>
            <span class="sub-header"> 特典内容を選択してください </span>
          </div>
          <v-chip-group v-model="slctdBnfts" multiple column>
            <v-chip v-for="(item, idx) in benefits" :key="idx" :value="item" filter outlined>
              {{ item }}
            </v-chip>
          </v-chip-group>
        </v-col>
        <!--        使用条件         -->
        <v-col cols="12" class="py-0 mb-5">
          <div class="header-item my-2">
            <p class="main-header">使用条件</p>
            <span class="sub-header"> 使用条件を選択してください </span>
          </div>
          <v-radio-group
            v-model="SaleOK"
            :rules="Rules"
            dense
            row
            class="ma-0"
            :disabled="chkNoSaleRakugae"
          >
            <v-radio label="セール可" :value="true"></v-radio>
            <v-radio label="セール不可" :value="false" color="red"></v-radio>
          </v-radio-group>
          <v-radio-group
            v-model="RakugaeOK"
            :rules="Rules"
            dense
            row
            class="ma-0"
            :disabled="chkNoSaleRakugae"
          >
            <v-radio label="楽替から可" :value="true"></v-radio>
            <v-radio label="楽替から不可" :value="false" color="red"></v-radio>
          </v-radio-group>
          <v-checkbox
            label="Sale楽替可否不要 (外部キャンペーン)"
            v-model="chkNoSaleRakugae"
            @change="chkSaleRakuga()"
            dense
          ></v-checkbox>
          <div v-for="(item, key) in conditions" :key="key" class="mb-5">
            <div v-if="key == 'price'">金額</div>
            <div v-if="key == 'Xing'">X-ing</div>
            <div v-if="key == 'situation'">状況</div>
            <v-chip-group v-model="slctdConds" multiple column>
              <v-chip v-for="(i, k) in item" :key="k" :value="i" filter outlined>
                {{ i }}
              </v-chip>
            </v-chip-group>
          </div>
        </v-col>
        <!-- 使用条件2 -->
        <v-col class="py-0 mb-5">
          <div class="header-item">
            <p class="main-header">特記事項</p>
            <span class="sub-header"> 特記事項があれば入力してください。 </span>
          </div>
          <v-text-field
            outlined
            dense
            v-model="remarks"
            color="success"
            label="特記事項"
            hide-details="auto"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-checkbox
            class="pa-0 ma-0"
            hide-details
            v-model="isDisplay"
            :true-value="1"
            :false-value="0"
            label="ツールに表示する"
          ></v-checkbox>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>
<script>
export default {
  data: function () {
    return {
      valid: true,
      slctdBnfts: [],
      slctdConds: [],
      chkNoSaleRakugae: false,
      SaleOK: null,
      RakugaeOK: null,
      Rules: [
        (v) => {
          if (!this.chkNoSaleRakugae) {
            if (v == true || v == false) {
              return true;
            } else {
              return '可否を選択してください';
            }
          } else {
            return true;
          }
        },
      ],
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
      conditions: {
        situation: [
          '電話OK',
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
        ],
        Xing: [
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
        ],
        price: [
          'クーポン金額以上',
          '【含まない】加工送料',
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
      },
      remarks: '',
      isDisplay: 1,
    };
  },
  methods: {
    chkSaleRakuga() {
      this.$refs.form.validate();
      if (this.chkNoSaleRakugae) {
        this.SaleOK = null;
        this.RakugaeOK = null;
        this.slctdConds = this.slctdConds.filter((val) => {
          return (
            val !== 'SALE OK' && val !== 'SALE NG' && val !== '楽替からOK' && val !== '楽替からNG'
          );
        });
      } else {
        this.valid = false;
      }
      this.$refs.form.resetValidation();
    },
    setConditions() {
      this.$refs.form.validate();
      if (this.valid) {
        if (!this.chkNoSaleRakugae) {
          this.slctdConds = this.slctdConds.filter((val) => {
            return (
              val !== 'SALE OK' && val !== 'SALE NG' && val !== '楽替からOK' && val !== '楽替からNG'
            );
          });
          if (this.SaleOK) {
            this.slctdConds.push('SALE OK');
          } else {
            this.slctdConds.push('SALE NG');
          }

          if (this.RakugaeOK) {
            this.slctdConds.push('楽替からOK');
          } else {
            this.slctdConds.push('楽替からNG');
          }
        }
        let obj = {};
        obj.benefits = JSON.parse(JSON.stringify(this.slctdBnfts));
        obj.conditions = JSON.parse(JSON.stringify(this.slctdConds));

        obj.remarks = this.remarks;
        obj.isDisplay = this.isDisplay;
        this.$store.commit('setConditions', obj);
        this.$emit('proceed-regist');
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
