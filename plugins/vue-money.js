import Vue from 'vue'
// import { VMoney } from 'vue-money'
import money from 'v-money'
console.log(money)
Vue.use(money, {
  precision: 4
})
// Vue.directive('money', VMoney)
