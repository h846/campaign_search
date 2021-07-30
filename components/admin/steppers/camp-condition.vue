<template>
  <v-card max-width="350" class="px-2 py-5 mb-5 mx-auto" flat>
    <v-form>
      <v-row>
        <v-col cols="12" class="py-0">
          <div class="header-item">
            <p class="main-header">送料無料</p>
            <span class="sub-header">
              送料無料の場合はチェックを入れてください
            </span>
          </div>
          <v-checkbox
            color="orange darken-3"
            label="送料無料"
            v-model="freeShipping"
          >
          </v-checkbox>
          <v-divider></v-divider>
        </v-col>
        <v-col cols="12" class="py-0">
          <div class="header-item my-2">
            <p class="main-header">使用条件1</p>
            <span class="sub-header">
              使用条件を選択してください
            </span>
          </div>
          <v-row no-gutters justify="center">
            <v-col
              cols="12"
              class="mt-2"
              v-for="(item, k, i) in conditions"
              :key="i"
            >
              <v-select
                v-model="selected"
                outlined
                multiple
                :label="k"
                :items="item"
                :clearable="true"
                :hide-details="true"
              >
              </v-select>
            </v-col>
            <v-divider class="mt-5"></v-divider>
          </v-row>

          <v-divider class="mt-3"></v-divider>
        </v-col>
        <!-- 使用条件2 -->
        <v-col>
          <div class="header-item">
            <p class="main-header">使用条件2</p>
            <span class="sub-header">
              使用条件2があれば入力してください。
            </span>
          </div>

          <v-text-field
            outlined
            v-model="condition2"
            color="success"
            label="使用条件2"
            hide-details="auto"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>
<script>
import { required, url, minLength } from "vuelidate/lib/validators";

export default {
  data: function() {
    return {
      freeShipping: false,
      selected: [],

      conditions: {
        条件: [
          "対象",
          "楽替不可",
          "〒",
          "楽替OK",
          "加工",
          "Xcat12",
          "Xcat17",
          "Xcat53",
          "tel",
          "sale可",
          "sale不可",
          "レディスのみ",
          "メンズのみ",
          "WEB専用",
          "1回のみ",
          "HEM",
          "FR",
          "金額",
          "1点のみ",
          "楽天",
          "セールONLY",
          "X",
          "X1",
          "X2",
          "X3",
          "X4",
          "X5",
          "X6",
          "X7",
          "X8",
          "X9",
          "X10",
          "X11",
          "X12"
        ],
        金額割引: [
          "5000円以上",
          "7000円以上",
          "7500円以上",
          "8000円以上",
          "15000円以上",
          "20000円以上",
          "500円OFF",
          "1000円OFF",
          "2000円OFF",
          "3000円OFF",
          "4000円OFF",
          "5000円OFF"
        ],
        パーセント割引: [
          "5%OFF",
          "10%OFF",
          "15%OFF",
          "20%OFF",
          "25%OFF",
          "30%OFF"
        ]
      },
      condition2: ""
    };
  },
  methods: {
    setConditions() {
      let obj = {};
      obj.freeShip = this.freeShipping;
      obj.condition1 = this.selected;
      obj.condition2 = this.condition2;
      this.$store.commit("setConditions", obj);
      this.$emit("proceed-regist");
    }
  }
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
