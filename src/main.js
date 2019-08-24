import Vue from 'vue'
import router from './router'
import axios from 'axios'
import iView from 'iview'
import App from './App'
import 'iview/dist/styles/iview.css'
import './common/css/reset.css'
import './common/css/common.less'
let Base64 = require('js-base64').Base64
import store from './store/index'


store.commit('setUserInfo', window.user)

window.homeurl = document.getElementsByTagName('meta')['baseurl'].content
axios.defaults.baseURL = homeurl

import {post} from './util/http.js'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
window.csrf_token = document.getElementsByTagName('meta')['csrf-token'].content;
axios.defaults.headers.post['X-CSRF-TOKEN'] = csrf_token;

Vue.prototype.$http = axios
Vue.prototype.$post = post

Vue.config.productionTip = false
Vue.use(iView)

import Print from 'vue-print-nb'
Vue.use(Print); //注册

new Vue({
	el: '#app',
	router,
	store,
	components: { App },
	template: '<App/>'
})
