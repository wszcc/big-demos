import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'

import  './assets/css/global.css'
import  './assets/css/normalize.css'
import './assets/iconfont/font_mvvzcfultr/iconfont.css'

import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
Vue.config.productionTip = false

// axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
axios.interceptors.request.use(config=>{
  config.headers.Authorization=window.sessionStorage.getItem('token')
  nprogress.start()
  return config
})
axios.interceptors.response.use(config=>{
  nprogress.done()
  return config
})
Vue.prototype.$http=axios
Vue.component('tree-table',TreeTable)
Vue.filter('dateFormat',function(orignVal){
  const dt= new Date(orignVal)
  
  const y=dt.getFullYear()
  const m=(dt.getMonth() +1+'').padStart(2,'0')
  const d=(dt.getDate()+'').padStart(2,'0')
  const hh=(dt.getHours()+'').padStart(2,'0')
  const mm=(dt.getMinutes()+'').padStart(2,'0')
  const ss=(dt.getSeconds()+'').padStart(2,'0')
  // return '${y}-${m}-${d} ${hh}:${mm}:${ss}'
  return ''+y+'-'+m+'-'+d+'-'+' '+hh+':'+mm+':'+ss
})



new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
