<template>
  <v-card elevation="1" class="px-4" outlined>
    <v-data-table
      :headers="headers"
      :items="list"
      :search="search"
      :expanded.sync="expanded"
      item-key="ID"
      show-expand
      hide-default-footer
      dense
      :page.sync="page"
      :items-per-page="10"
      @page-count="pageCount = $event"
      :loading="loading"
      loading-text="読み込み中.....少々お待ちください。"
    >
      <!-- Search Form -->
      <template v-slot:top>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="フリーワード検索"
          class="my-3"
        ></v-text-field>
      </template>
      <!-- Custom Cols -->
      <template v-slot:[`item.ref`]="{ item }">
        <div v-for="(i, idx) in item.ref" :key="idx">
          <a :href="item.ref[idx + 1]" target="_blank" v-if="idx % 2 == 0">{{ item.ref[idx] }}</a>
        </div>
      </template>
      <template v-slot:[`item.isExpired`]="{ item }">
        <v-chip v-if="item.isExpired" class="my-2" small color="red" text-color="white"
          >期限切れ</v-chip
        >
      </template>
      <!-- Expand -->
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length" class="pa-5 ">
          <div class="mb-1">
            種類:
            <span class="font-weight-bold ml-1">{{ item['種別'] }}</span>
          </div>
          <div class="mb-1">
            取得方法:
            <span class="font-weight-bold ml-1">{{ item['取得方法'] }}</span>
          </div>
          <div v-if="!!item.benefits" class="mb-1">
            特典内容:
            <v-chip
              small
              color="success"
              v-for="(benefit, k) in item.benefits"
              :key="k"
              class="ml-1"
            >
              {{ benefit }}
            </v-chip>
          </div>
          <div v-if="!!item['使用条件1']" class="mb-1">
            使用条件:
            <v-chip v-for="(i, k) in item.conditions" :key="k" small color="primary" class="ml-1">{{
              i
            }}</v-chip>
          </div>
          <div v-if="!!item['使用条件2']">
            特記事項:
            <span class="font-weight-bold">{{ item['使用条件2'] }}</span>
          </div>
          <!-- 以下アドミンモード時に表示 -->
          <div v-if="adminMode == true" class="mt-10">
            <!-- 編集ボタン & ダイアログ-->
            <v-dialog v-model="dialogEdit" width="500">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="info"
                  class="mr-5"
                  v-bind="attrs"
                  v-on="on"
                  @click="edit(item['campaign_data_test.ID'])"
                  >編集</v-btn
                >
              </template>
              <v-card>
                <v-card-title
                  >キャンペーンID: {{ item['campaign_data_test.ID'] }}を編集中</v-card-title
                >
                <!-- Edit Form -->
                <!-- ここから作成 -->
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
                    <v-col cols="12" class="mb-2"
                      ><div class="heading mb-3">キャンペーン期間</div>
                    </v-col>
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
                        />
                      </v-menu>
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
                    <v-chip
                      filter
                      outlined
                      v-for="(i, idx) in forms.benefits"
                      :key="idx"
                      :value="i"
                      >{{ i }}</v-chip
                    >
                  </v-chip-group>
                  <v-divider class="my-3"></v-divider>
                  <div class="heading">使用条件</div>
                  <div>金額</div>
                  <v-chip-group
                    light
                    multiple
                    column
                    center-active
                    v-model="forms.selectedCondition"
                  >
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
                  <v-chip-group
                    light
                    multiple
                    column
                    center-active
                    v-model="forms.selectedCondition"
                  >
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
                  <v-chip-group
                    light
                    multiple
                    column
                    center-active
                    v-model="forms.selectedCondition"
                  >
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
                  <div class="heading mb-2">補足情報</div>
                  <v-textarea
                    outlined
                    label="補足情報"
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
                        class="mb-6"
                      ></v-text-field>
                    </div>
                  </div>
                  <div style="text-align:right;">
                    <v-btn @click="addRef" small color="success" dark fab
                      ><v-icon large>mdi-plus</v-icon></v-btn
                    >
                  </div>
                  <v-divider class="my-5"></v-divider>
                  <!-- 表示非表示-->
                  <v-checkbox v-model="forms.isDisplay" label="表示する"></v-checkbox>
                  <v-divider class="my-5"></v-divider>
                  <!-- Submit Cancel-->
                  <v-layout>
                    <v-flex xs6 class="mx-2">
                      <v-btn color="success" block @click="update()" :loading="loading">更新</v-btn>
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
                <v-btn color="error" dark v-bind="attrs" v-on="on">
                  削除
                </v-btn>
              </template>
              <v-card>
                <v-card-title class="text-h7 white--text red lighten-2">
                  削除してもよろしいですか？
                </v-card-title>

                <v-card-actions class="py-10">
                  <v-btn
                    x-large
                    class="mx-auto"
                    color="error"
                    @click="remove(item['campaign_data_test.ID'])"
                  >
                    削除する
                  </v-btn>
                  <v-btn x-large class="mx-auto" @click="dialogRemove = false">キャンセル</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </td>
      </template>
    </v-data-table>
    <v-card-actions>
      <v-pagination v-model="page" :length="20"></v-pagination>
    </v-card-actions>
  </v-card>
</template>
<script>
import axios from 'axios';

export default {
  props: { campaignList: Array, loading: Boolean, adminMode: Boolean },
  data: function() {
    return {
      list: [],
      page: 1,
      pageCount: 0,
      search: '',
      headers: [
        { text: '', value: 'isExpired', sortable: false },
        { text: '詳細', value: 'data-table-expand' },
        { text: '概要', value: '概要', sortable: false },
        { text: 'コード', value: 'コード', sortable: false },
        { text: '資料', value: 'ref', sortable: false },
        { text: '開始日', value: '開始日' },
        { text: '終了日', value: '終了日' },
      ],
      expanded: [],
      dialogEdit: false,
      dialogRemove: false,
      //for Edit Form
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
            'X-ing Cat.12',
            'X-ing Cat.17',
            'X-ing Cat.53',
            'X-ing 対象購入',
            'X-ing 対象商品',
          ],
        },
        remark: '',
        refs: ['', ''],
        isDisplay: true,
      },
      loading: false,
    };
  },
  methods: {
    validDate: function(arg) {
      let now = this.$moment().format('YYYY-MM-DD');
      let endDate = this.$moment(arg);
      return endDate.isBefore(now);
    },
    rtnList: function() {
      //リスト整形処理
      let list = this.campaignList.map((val, idx) => {
        //format date
        val['終了日'] = this.$moment(val['終了日']).format('YYYY-MM-DD');
        // If the campaign period has already expired, flag it.
        val.isExpired = this.validDate(val['終了日']);
        val['終了日'] = String(val['終了日']).replace(/-/g, '/');
        //プロパティ名に日本語は使えないのでrefプロパティとして入れ替える
        //レコードの中身がカンマとスペースと改行コードなど混合構成されているので、データとして使えるように整形する
        let tmp = String(val['資料']).split(/[,\s\r\n]/g);
        //空文字除去
        val.ref = tmp.filter(val => !!val);
        //特典内容整形
        val.benefits = String(val['特典内容']) == '' ? '' : String(val['特典内容']).split(',');
        //使用条件整形
        val.conditions = String(val['使用条件1']) == '' ? '' : String(val['使用条件1']).split(',');
        //ID付与(for Expand)
        val.ID = idx;

        return val;
      });

      // Sort by date
      list = list.sort((a, b) => {
        if (a['終了日'] > b['終了日']) {
          return -1;
        } else {
          return 1;
        }
      });
      console.log(list);
      //if NOT admin mode
      if (!this.$store.state.adminMode) {
        list = list.filter(val => {
          return val['出力'] == 1 || val['出力'] == true;
        });
      }
      this.list = list;
      this.$emit('loaded');
    },
    // 編集ボタンをおしたら
    edit(campID) {
      this.currentID = campID;
      // DBのデータでフォームをうめる
      let item = this.list.filter(val => {
        return val['campaign_data_test.ID'] == campID;
      });
      item = item[0];
      this.forms.selectTypes = { label: item['種別'], value: item['種別'] };
      this.forms.code = item['コード'];
      this.forms.startDate = item['開始日'];
      this.forms.endDate = item['終了日'];
      this.forms.summary = item['概要'];
      this.forms.getMethod = item['取得方法'];

      this.forms.selectedBenefit = [];
      this.forms.selectedCondition = [];

      if (item.benefits.length > 0) {
        for (let i of item.benefits) {
          this.forms.selectedBenefit.push(i);
        }
      }

      if (item.conditions > 0) {
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

      this.forms.remark = item['使用条件2'];

      this.forms.isDisplay = item['出力'];
    },
    update() {
      this.loading = true;
      let id = this.currentID;
      let sql = `UPDATE campaign_data_test SET `;
      let data = [
        { col: '種別', val: `'${this.forms.selectTypes.value}'` },
        { col: 'コード', val: `'${this.forms.code}'` },
        { col: '開始日', val: `'${this.forms.startDate}'` },
        { col: '終了日', val: `'${this.forms.endDate}'` },
        { col: '概要', val: `'${this.forms.summary}'` },
        { col: '取得方法', val: `'${this.forms.getMethod}'` },
        { col: '特典内容', val: `'${this.forms.selectedBenefit.join()}'` },
        { col: '使用条件1', val: `'${this.forms.selectedCondition.join()}'` },
        { col: '使用条件2', val: `'${this.forms.remark}'` },
        { col: '資料', val: `'${this.forms.refs.join()}'` },
        { col: '出力', val: `'${this.forms.isDisplay}'` },
      ];

      data.map((val, index) => {
        sql += index != 0 ? ',' : '';
        sql += ` ${val.col} = ${val.val}`;
      });

      sql += ` WHERE ID = ${id}`;

      console.log(sql);

      axios
        .post('http://lejnet/api/accdb/', {
          db: 'CSNet/dataCenter/DB/Product/campaign_test.accdb',
          sql: sql,
        })
        .then(res => {
          this.loading = false;
          this.dialogEdit = false;
          this.$emit('reloadlist');
        })
        .catch(err => console.log(err));
    },
    remove(campID) {
      let sql = 'DELETE FROM `campaign_data_test` WHERE `ID` = ' + campID;
      axios
        .post('http://lejnet/api/accdb/', {
          db: 'CSNet/dataCenter/DB/Product/campaign_test.accdb',
          sql: sql,
        })
        .then(res => {
          this.dialogRemove = false;
          this.$emit('reloadlist');
        })
        .catch(err => console.log(err));
    },
    addRef() {
      this.forms.refs.push('');
      this.forms.refs.push('');
    },
  },
  watch: {
    campaignList: function() {
      this.rtnList();
    },
  },
};
</script>

<style lang="scss" scoped>
.v-text-field {
  width: 400px;
  margin: 0 0 0 auto;
}

#edit-form {
  width: 300px;
  margin: 0 auto;
  padding: 20px 10px;
}

.heading {
  font-size: 20px;
  border-left: 5px solid #002566;
  padding-left: 5px;
}
</style>
