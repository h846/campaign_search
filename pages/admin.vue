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
            <v-btn
              color="primary"
              width="140"
              class="ml-6"
              @click="trgSetDetail()"
            >
              次へ
            </v-btn>
          </div>
        </v-stepper-content>

        <v-stepper-content step="3">
          <!-- 条件コンポーネント -->
          <camp-condition
            ref="conditioncompo"
            @proceed-regist="registratoin()"
          />

          <div style="text-align:center;">
            <v-btn width="140" class="mr-6" @click="stepper = 2">
              戻る
            </v-btn>
            <v-btn
              color="primary"
              width="140"
              class="ml-6"
              @click="trgSetCondition()"
            >
              登録
            </v-btn>
          </div>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
    <!-- Regist Comfirm Dialog -->
    <v-dialog v-model="dialog" persistent>
      <v-card>
        <v-card-title class="text-h5">
          以下の内容で登録します。よろしいですか？
        </v-card-title>
        <v-list two-line subheader>
          <v-list-item v-for="(item, k, i) in campInfo" :key="i">
            <v-list-item-content>
              <v-list-item-title>{{ item }}</v-list-item-title>
              <v-list-item-subtitle>{{ k }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-card-actions>
          <v-btn color="primary">登録する</v-btn>
          <v-btn @click="dialog = false">キャンセル</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import campaign from "@/components/admin/steppers/campagin.vue";
import campDetail from "@/components/admin/steppers/camp-detail.vue";
import campCondition from "@/components/admin/steppers/camp-condition.vue";

export default {
  components: {
    campaign,
    campDetail,
    campCondition
  },
  data: function() {
    return {
      stepper: 1,
      dialog: false,
      campInfo: {}
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
    registratoin() {
      this.campInfo = {
        キャンペーン種別: this.$store.state.campType,
        キャンペーンコード: this.$store.state.campCode,
        開始日: this.$store.dateStart,
        終了日: this.$store.dateEnd,
        キャンペーン概要: this.$store.summary,
        取得方法: this.$store.getMethod,
        参考資料: this.$store.ref,
        参考資料URL: this.$store.refURL,
        送料無料: this.$store.freeShip,
        条件1: this.$store.condition1,
        条件2: this.$store.condition2
      };

      this.dialog = true;
    }
  }
};
</script>
