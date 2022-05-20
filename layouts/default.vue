<template>
  <v-app dark>
    <appBar />
    <v-main>
      <nuxt />
    </v-main>
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
