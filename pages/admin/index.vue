<template> </template>
<script>
export default {
  created() {
    this.$store.commit('setAdminMode');
    this.$router.push('/');
  },
};
</script>
