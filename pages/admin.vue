<template>
  <v-container style="width:500px;">
    <v-stepper v-model="stepper">
      <v-stepper-header>
        <v-stepper-step :complete="stepper > 1" step="1">
          キャンペーン情報
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="stepper > 2" step="2">
          詳細情報
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step step="3">
          使用条件
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items class="pb-5">
        <v-stepper-content step="1">
          <!--キャンペーン情報コンポーネント-->
          <campaign ref="campcompo" />
          <div style="text-align:center;">
            <v-btn
              color="primary"
              width="340px"
              @click="
                stepper = 2;
                trgSetCampInfo();
              "
            >
              次へ
            </v-btn>
          </div>
        </v-stepper-content>

        <v-stepper-content step="2">
          <!-- 詳細情報コンポーネント -->
          <camp-detail ref="detailcompo" @go-to-next="stepper = 3" />

          <div style="text-align:center;">
            <v-btn width="140" class="mr-6" @click="stepper = 1">
              戻る
            </v-btn>
            <v-btn color="primary" width="140" class="ml-6" @click="trgSetDetail()">
              次へ
            </v-btn>
          </div>
        </v-stepper-content>

        <v-stepper-content step="3">
          <!-- 条件コンポーネント -->
          <camp-condition ref="conditioncompo" @proceed-regist="comfirm()" />

          <div style="text-align:center;">
            <v-btn width="140" class="mr-6" @click="stepper = 2">
              戻る
            </v-btn>
            <v-btn color="primary" width="140" class="ml-6" @click="trgSetCondition()">
              登録
            </v-btn>
          </div>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
    <!-- Regist Comfirm Dialog -->
    <v-dialog v-model="dialog" width="500" persistent>
      <v-card>
        <v-card-title class="text-h5">
          以下の内容で登録します。よろしいですか？
        </v-card-title>
        <v-list two-line subheader>
          <v-list-item v-for="(item, k, i) in campInfo" :key="i">
            <v-list-item-content>
              <v-list-item-subtitle>{{ k }}</v-list-item-subtitle>
              <v-list-item-title>{{ item }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-card-actions>
          <v-btn color="primary" @click="registration()">登録する</v-btn>
          <v-btn @click="dialog = false">キャンセル</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Laoding Overlay-->
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <!-- Complete Snackbar-->
    <v-snackbar v-model="snackbar" :timeout="3000">
      <span>登録完了しました！</span>
      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          閉じる
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
<script>
import axios from 'axios';

import campaign from '@/components/admin/steppers/campagin.vue';
import campDetail from '@/components/admin/steppers/camp-detail.vue';
import campCondition from '@/components/admin/steppers/camp-condition.vue';

export default {
  components: {
    campaign,
    campDetail,
    campCondition,
  },
  data: function() {
    return {
      stepper: 1,
      dialog: false,
      campInfo: {},
      overlay: false,
      snackbar: false,
    };
  },
  methods: {
    trgSetCampInfo() {
      this.$refs.campcompo.setCampInfo();
    },
    trgSetDetail() {
      this.$refs.detailcompo.setDetails();
    },
    trgSetCondition() {
      this.$refs.conditioncompo.setConditions();
    },
    comfirm() {
      this.campInfo = {
        キャンペーン種別: `'${this.$store.state.campType}'`,
        キャンペーンコード: this.$store.state.campCode,
        開始日: this.$store.state.dateStart,
        終了日: this.$store.state.dateEnd,
        キャンペーン概要: this.$store.state.summary,
        取得方法: this.$store.state.getMethod,
        参考資料: this.$store.state.ref,
        参考資料URL: this.$store.state.refURL,
        特典内容: this.$store.state.benefits,
        使用条件: this.$store.state.conditions,
        特記事項: this.$store.state.remarks,
      };

      this.dialog = true;
    },
    registration() {
      this.dialog = false;
      this.overlay = true;
      this.campInfo['特典内容'] = this.campInfo['特典内容'].join();
      this.campInfo['使用条件'] = this.campInfo['使用条件'].join();
      this.campInfo['参考資料'] = this.campInfo['参考資料'] + ',' + this.campInfo['参考資料URL'];
      delete this.campInfo['参考資料URL'];

      let cols =
        '(種別, コード, 開始日, 終了日, 概要, 取得方法, 資料, 特典内容, 使用条件1, 使用条件2)';
      let vals = Object.values(this.campInfo);
      vals = vals.reduce((a, b) => {
        return `${a},` + `'${b}'`;
      });
      vals = `(${vals})`;

      let sql = `INSERT INTO \`campaign_data_test\` ${cols} VALUES ${vals};`;
      console.log(sql);
      axios
        .post('http://lejnet/api/accdb', {
          db: 'CSNet/dataCenter/DB/Product/campaign.accdb',
          sql: sql,
        })
        .then(res => {
          this.overlay = false;
          this.snackbar = true;
          this.$router.push('/');
        })
        .catch(err => {
          console.log(err);
        });
    },
  },
};
</script>
