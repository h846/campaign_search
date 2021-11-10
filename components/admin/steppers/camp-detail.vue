<template>
  <v-card max-width="350" class="px-2 py-5 mb-5 mx-auto" flat>
    <v-form>
      <v-row>
        <!-- キャンペーン概要-->
        <v-col cols="12">
          <div class="header-item">
            <p class="main-header">キャンペーン概要</p>
            <span class="sub-header">
              キャンペーンの名前や概要を入力してください。
            </span>
          </div>

          <v-text-field
            outlined
            v-model="summary"
            color="success"
            label="例: 購買促進キャンペーン"
            hide-details="auto"
            dense
            :error-messages="errMsg"
            class="mb-2"
          ></v-text-field>
          <v-divider class="mt-6"></v-divider>
        </v-col>
        <!-- 取得方法 -->
        <v-col cols="12">
          <div class="header-item">
            <p class="main-header">取得方法</p>
            <span class="sub-header">
              キャンペーンの取得方法を入力してください。
            </span>
          </div>

          <v-text-field
            outlined
            v-model="getMethod"
            color="success"
            label="取得方法"
            hide-details="auto"
            dense
            class="mb-2"
          ></v-text-field>
          <v-divider class="mt-6"></v-divider>
        </v-col>
        <!-- Referrence Section-->
        <v-col cols="12" class="py-0">
          <div class="header-item">
            <p class="main-header">資料</p>
            <span class="sub-header">
              資料がある場合は名前とURLを入力してください
            </span>
          </div>
          <v-text-field
            outlined
            v-model="refName"
            color="success"
            label="資料の名前"
            hide-details="auto"
            dense
            class="mb-2"
          ></v-text-field>
          <v-text-field
            outlined
            v-model="refURL"
            color="success"
            label="資料のURL"
            hide-details="auto"
            dense
            :error-messages="errMsgURL"
            class="mb-2"
            clearable
          ></v-text-field>
          <div class="text-right">
            <v-btn
              x-small
              class="mb-3"
              @click="refURL = 'http://lejnet/csnet/order_tool/campaign_search/pdf/'"
              >BASE LINK</v-btn
            >
          </div>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>
<script>
import { required, url } from 'vuelidate/lib/validators';

export default {
  data: function() {
    return {
      summary: '',
      errMsg: '',
      errMsgURL: '',
      getMethod: '',
      refName: '',
      refURL: '',
    };
  },
  validations: {
    summary: {
      required,
    },
    refURL: {
      url,
    },
  },
  methods: {
    setDetails() {
      console.log(this.$v.summary.$invalid);
      if (this.$v.summary.$invalid) {
        this.errMsg = '入力してください';
        //   } else if (this.$v.refURL.$invalid) {
        //     this.errMsgURL = '正しいURLの形式を入力してください';
      } else {
        let obj = {};
        obj.summary = this.summary;
        obj.getMethod = this.getMethod;
        obj.ref = this.refName;
        obj.refURL = this.refURL;
        this.$store.commit('setDetails', obj);
        this.$emit('go-to-next');
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
