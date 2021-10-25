<template>
  <v-app dark>
    <appBar />
    <v-main>
      <nuxt />
    </v-main>
    <!--
    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
    -->
  </v-app>
</template>

<script>
import appBar from '@/components/appbar.vue';
export default {
  components: {
    appBar,
  },
};
</script>
