<template>
  <section>
    <!-- 管理者モード -->
    <!-- 編集ボタン & ダイアログ-->
    <v-dialog v-model="dialogEdit" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="info" small class="mb-1" v-bind="attrs" v-on="on" @click="edit(itemid)">
          編集
        </v-btn>
      </template>
      <v-card class="pa-5">
        <v-card-title>キャンペーンID: {{ itemid }}を編集中</v-card-title>
        <!-- Edit Form -->
        <v-form id="edit-form">
          <v-select
            v-model="forms.selectTypes"
            :items="forms.types"
            item-text="label"
            item-value="value"
            return-object
            label="種類"
            dense
            hide-details
            outlined
            class="mb-5"
          ></v-select>
          <v-text-field
            v-model="forms.code"
            label="キャンペーンコード"
            outlined
            hide-details
            dense
            class="mb-5"
          ></v-text-field>
          <v-row no-gutters justify="space-between" class="mb-5">
            <v-col cols="12" class="mb-2"><div class="heading mb-3">キャンペーン期間</div> </v-col>
            <v-col cols="5">
              <v-menu max-width="300px" min-width="300px" offset-y>
                <!-- ポップアップを追加する要素にv-on="on" -->
                <template v-slot:activator="{ on }">
                  <v-text-field
                    slot="activator"
                    v-model="forms.startDate"
                    label="開始日"
                    hide-details="auto"
                    readonly
                    v-on="on"
                    class="ma-0 pa-0"
                  />
                </template>
                <!-- ポップアップされる内容-->
                <v-date-picker
                  v-model="forms.startDate"
                  locale="jp-ja"
                  :day-format="date => new Date(date).getDate()"
                  no-title
                  :disabled="dateDisabled"
                />
              </v-menu>
            </v-col>
            <v-col cols="1" align-self="center">
              <v-icon>mdi-arrow-right-bold-outline</v-icon>
            </v-col>
            <v-col cols="5">
              <v-menu offset-y>
                <!-- ポップアップを追加する要素にv-on="on" -->
                <template v-slot:activator="{ on }">
                  <v-text-field
                    slot="activator"
                    v-model="forms.endDate"
                    label="終了日"
                    readonly
                    hide-details="auto"
                    v-on="on"
                    class="ma-0 pa-0 ml-3"
                  />
                </template>
                <!-- ポップアップされる内容-->
                <v-date-picker
                  v-model="forms.endDate"
                  locale="jp-ja"
                  :day-format="date => new Date(date).getDate()"
                  no-title
                  :disabled="dateDisabled"
                />
              </v-menu>
            </v-col>
            <v-col cols="12">
              <v-checkbox
                v-model="undicided"
                label="期間未定"
                @change="undicidedChecked"
              ></v-checkbox>
            </v-col>
          </v-row>
          <v-text-field
            v-model="forms.summary"
            label="概要"
            outlined
            hide-details
            dense
            class="mb-5"
          ></v-text-field>
          <v-textarea
            outlined
            label="取得方法"
            row-height="15"
            rows="5"
            v-model="forms.getMethod"
            class="mb-5"
            hide-details
          ></v-textarea>
          <!-- 特典内容 -->
          <div class="heading">特典内容</div>
          <v-chip-group light multiple column center-active v-model="forms.selectedBenefit">
            <v-chip filter outlined v-for="(i, idx) in forms.benefits" :key="idx" :value="i">{{
              i
            }}</v-chip>
          </v-chip-group>
          <v-divider class="my-3"></v-divider>
          <div class="heading">使用条件</div>
          <div>金額</div>
          <v-chip-group light multiple column center-active v-model="forms.selectedCondition">
            <v-chip
              filter
              outlined
              v-for="(i, idx) in forms.conditions.price"
              :key="idx"
              :value="i"
              >{{ i }}</v-chip
            >
          </v-chip-group>
          <v-divider class="my-3"></v-divider>
          <div>状況</div>
          <v-chip-group light multiple column center-active v-model="forms.selectedCondition">
            <v-chip
              filter
              outlined
              v-for="(i, idx) in forms.conditions.situation"
              :key="idx"
              :value="i"
              >{{ i }}</v-chip
            >
          </v-chip-group>
          <v-divider class="my-3"></v-divider>
          <div>Xing関連</div>
          <v-chip-group light multiple column center-active v-model="forms.selectedCondition">
            <v-chip
              filter
              outlined
              v-for="(i, idx) in forms.conditions.xing"
              :key="idx"
              :value="i"
              >{{ i }}</v-chip
            >
          </v-chip-group>
          <v-divider class="my-3"></v-divider>
          <!-- 補足情報-->
          <div class="heading mb-2">特記事項</div>
          <v-textarea
            outlined
            label="キャンペーンや期間に関する特記事項"
            row-height="15"
            rows="2"
            v-model="forms.remark"
            class="mb-5"
            hide-details
          ></v-textarea>
          <!-- 資料 -->
          <div class="heading mb-3">資料</div>
          <div v-for="(item, idx) in forms.refs" :key="idx">
            <div v-if="idx % 2 == 0">
              <v-text-field
                v-model="forms.refs[idx]"
                label="資料名"
                outlined
                hide-details
                dense
                class="mb-2"
              ></v-text-field>

              <v-text-field
                v-model="forms.refs[idx + 1]"
                label="資料URL"
                outlined
                hide-details
                dense
                clearable
                class="mb-1"
              ></v-text-field>
              <div class="text-right">
                <v-btn x-small class="mb-3" @click="addDefoURL(idx + 1)">BASE LINK</v-btn>
              </div>
            </div>
          </div>
          <div style="text-align:right;" class="mb-3">
            <v-btn @click="addRef" small color="success" dark fab
              ><v-icon large>mdi-plus</v-icon></v-btn
            >
          </div>
          <!--
          <v-divider class="my-5"></v-divider>
           --   表示非表示 ---
          <v-checkbox v-model="forms.isDisplay" label="表示する"></v-checkbox>
          <v-divider class="my-5"></v-divider>
          -->
          <!-- Submit Cancel-->
          <v-layout>
            <v-flex xs6 class="mx-2">
              <v-btn color="success" block @click="update()" :loading="formloading">更新</v-btn>
            </v-flex>
            <v-flex xs6 class="mx-2">
              <v-btn block @click="dialogEdit = false">キャンセル</v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-card>
      <!-- Update Complete Dialog-->
    </v-dialog>

    <!-- 削除ボタン & ダイアログ-->
    <v-dialog v-model="dialogRemove" width="350">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="error" small class="mb-1" dark v-bind="attrs" v-on="on">
          削除
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="text-h7 white--text red lighten-2">
          削除してもよろしいですか？
        </v-card-title>

        <v-card-actions class="py-10">
          <v-btn x-large class="mx-auto" color="error" @click="remove(itemid)">
            削除する
          </v-btn>
          <v-btn x-large class="mx-auto" @click="dialogRemove = false">キャンセル</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>
<script>
import axios from 'axios';
export default {
  props: ['list', 'itemid'],
  data() {
    return {
      dialogEdit: false,
      dialogRemove: false,
      dateDisabled: false,
      undicided: false,
      forms: {
        currentID: '',
        selectTypes: { label: 'カタログ', value: 'カタログ' },
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
        code: '',
        startDate: '',
        endDate: '',
        summary: '',
        getMethod: '',
        selectedBenefit: [],
        benefits: [
          '送料無料',
          '裾上げ無料',
          '5%OFF',
          '10%OFF',
          '15%OFF',
          '20%OFF',
          '25%OFF',
          '30%OFF',
          '35%OFF',
          '40%OFF',
          '500円OFF',
          '1000円OFF',
          '1500円OFF',
          '2000円OFF',
          '2500円OFF',
          '3000円OFF',
          '4000円OFF',
          '5000円OFF',
        ],
        selectedCondition: [],
        conditions: {
          price: [
            'クーポン金額以上',
            '加工送料含まない',
            '電話OK',
            '2000円以上',
            '3000円以上',
            '4000円以上',
            '5000円以上',
            '6000円以上',
            '7000円以上',
            '7500円以上',
            '8000円以上',
            '9000円以上',
            '10000円以上',
            '12000円以上',
            '15000円以上',
            '20000円以上',
          ],
          situation: [
            'Sale・楽替可否不要',
            'SALE NG',
            'SALE OK',
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
            '1点のみ',
          ],
          xing: [
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
            'Xcat12',
            'Xcat17',
            'Xcat53',
            'X-ing 対象購入',
            'X-ing 対象商品',
          ],
        },
        remark: '',
        refs: ['', ''],
        isDisplay: true,
      },
      formloading: false,
    };
  },
  methods: {
    // 編集ボタンをおしたら
    edit(campID) {
      this.currentID = campID;
      // DBのデータでフォームをうめる
      let item = this.list.filter(val => {
        return val.ID == campID;
      });

      item = item[0];

      console.log(item.conditions, item.benefits);

      this.forms.selectTypes = { label: item.TYPE, value: item.TYPE };
      this.forms.code = item.CODE;
      this.forms.startDate = this.$moment(item.START_DATE).format('YYYY-MM-DD');
      this.forms.endDate = this.$moment(item.END_DATE).format('YYYY-MM-DD');
      this.forms.summary = item.SUMMARY;
      this.forms.getMethod = item.GET_METHOD;

      this.forms.selectedBenefit = [];
      this.forms.selectedCondition = [];

      if (item.benefits.length > 0) {
        for (let i of item.benefits) {
          this.forms.selectedBenefit.push(i);
        }
      }

      if (item.conditions.length > 0) {
        for (let i of item.conditions) {
          this.forms.selectedCondition.push(i);
        }
      }
      this.forms.refs = [];
      if (item.ref.length > 0) {
        for (let i of item.ref) {
          this.forms.refs.push(i);
        }
      } else {
        this.forms.refs = ['', ''];
      }

      this.forms.remark = item.USE_CONDITION2 == 'null' ? '' : item.USE_CONDITION2;

      this.forms.isDisplay = item.OUTPUT;
    },
    update() {
      this.formloading = true;
      let id = this.currentID;
      let sql = `UPDATE CSNET.CAMPAIGN_DATA SET `;
      let data = [
        { col: 'TYPE', val: `'${this.forms.selectTypes.value}'` },
        { col: 'CODE', val: `'${this.forms.code}'` },
        { col: 'START_DATE', val: `'${this.forms.startDate}'` },
        { col: 'END_DATE', val: `'${this.forms.endDate}'` },
        { col: 'SUMMARY', val: `'${this.forms.summary}'` },
        { col: 'GET_METHOD', val: `'${this.forms.getMethod}'` },
        { col: 'BENEFITS', val: `'${this.forms.selectedBenefit.join()}'` },
        { col: 'USE_CONDITION1', val: `'${this.forms.selectedCondition.join()}'` },
        { col: 'USE_CONDITION2', val: `'${this.forms.remark}'` },
        { col: 'REFS', val: `'${this.forms.refs.join()}'` },
        { col: 'OUTPUT', val: `'${this.forms.isDisplay}'` },
      ];

      data.map((val, index) => {
        sql += index != 0 ? ',' : '';
        sql += ` ${val.col} = ${val.val}`;
      });

      sql += ` WHERE ID = ${id}`;

      console.log(sql);

      axios
        .post('http://lejnet/api/oracle/camp_data', {
          sql: sql,
        })
        .then(res => {
          this.formloading = false;
          this.dialogEdit = false;
        })
        .catch(err => console.log(err))
        .finally(() => {
          this.$emit('reloadList');
        });
    },
    remove(campID) {
      let sql = 'DELETE FROM `CSNET.CAMPAIGN_DATA` WHERE `ID` = ' + campID;
      axios
        .post('http://lejnet/api/oracle/camp_data', {
          sql: sql,
        })
        .then(res => {
          this.dialogRemove = false;
        })
        .catch(err => console.log(err))
        .finally(() => {
          this.$emit('reloadList');
        });
    },
    addRef() {
      this.forms.refs.push('');
      this.forms.refs.push('');
    },
    addDefoURL(idx) {
      console.log(this.forms.refs[idx]);
      this.$set(this.forms.refs, idx, 'http://lejnet/csnet/order_tool/campaign_search/pdf/');
    },

    undicidedChecked() {
      if (this.undicided) {
        this.dateDisabled = true;
        this.forms.startDate = '';
        this.forms.endDate = '9999-12-31';
        console.log('無効');
      } else {
        this.dateDisabled = false;
        this.forms.startDate = '';
        this.forms.endDate = this.$moment().format('YYYY-MM-DD');
      }
    },
  },
};
</script>
