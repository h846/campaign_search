<template>
  <v-app-bar app hide-on-scroll dense :class="{ appbar: isAdmin }">
    <v-toolbar-title>
      <nuxt-link to="/" style="text-decoration: none; color: #333"> {{ title }}</nuxt-link>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <!--<v-btn text color="primary">価格上書電卓</v-btn>-->
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
</template>

<script>
export default {
  components: {},
  data() {
    return {
      title: '',
      isAdmin: false,
    };
  },
  mounted() {
    this.isAdmin = this.$store.state.adminMode;
    console.log(this.isAdmin);
    this.title = this.isAdmin == false ? 'キャンペーン検索' : '【 管理 】キャンペーン検索';
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
