<template>
  <v-app dark>
    <v-app-bar fixed app dense :class="{ appbar: isAdmin }">
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
      <!-- Admin page -->
      <div v-if="isAdmin">
        <v-menu transition="slide-y-transition" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark text class="red--text" v-bind="attrs" v-on="on">
              管理者モードON
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-btn block text to="/admin/create">新規作成</v-btn>
            </v-list-item>
            <v-list-item>
              <v-btn block text to="/">更新</v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
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
      isAdmin: '',
    };
  },
  mounted() {
    this.isAdmin = this.$store.state.adminMode;
  },
};
</script>
<style lang="scss" scoped>
.image {
  width: 600px;
  height: auto;
}

.appbar {
  background-color: #ffebee !important;
}
</style>
