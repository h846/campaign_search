<template>
  <v-app dark>
    <v-app-bar fixed app dense>
      <v-toolbar-title>
        <nuxt-link to="/" style="text-decoration:none;color:#333;"> {{ title }}</nuxt-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text color="primary">価格上書電卓</v-btn>
      <v-dialog width="600">
        <template v-slot:activator="{ on, attrs }">
          <v-btn text color="primary" v-bind="attrs" v-on="on">セット・プレゼント交換ルール</v-btn>
        </template>
        <img class="image" src="~/assets/img/raku.png" />
      </v-dialog>

      <v-dialog width="600">
        <template v-slot:activator="{ on, attrs }">
          <v-btn text color="primary" v-bind="attrs" v-on="on">楽替適用ルール</v-btn>
        </template>
        <img class="image" src="~/assets/img/flowchart.png" />
      </v-dialog>
      <v-btn text color="primary" to="/admin/create">管理者用ページ</v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      title: 'キャンペーン検索',
    };
  },
};
</script>
<style lang="scss" scoped>
.image {
  width: 600px;
  height: auto;
}
</style>
