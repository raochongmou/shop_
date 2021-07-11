import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
import TableTree from "vue-table-with-tree-grid"

// axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/';
axios.defaults.baseURL = '/api/private/v1/';
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
})

Vue.component("table-tree",TableTree)

Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
