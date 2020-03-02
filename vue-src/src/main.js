import Vue from 'vue'
import App from './App.vue'
import VueImg from "v-img";
import ToggleButton from 'vue-js-toggle-button'
import VueHtmlToPaper from 'vue-html-to-paper'
import router from './router'
import VueFriendlyIframe from 'vue-friendly-iframe';
import SweetModal from 'sweet-modal-vue/src/plugin.js';
// import Bootstrap from 'bootstrap';
// import Jquery from 'jquery';
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap/dist/js/bootstrap.min.js'
// import 'jquery/dist/jquery.min.js'


// Vue.use(Bootstrap);
// Vue.use(Jquery);
// Vue.use(SweetModal)


Vue.component('vue-friendly-iframe', VueFriendlyIframe);

const moment = require('moment')
require('moment/locale/th')

Vue.use(require('vue-moment'), {
  moment
})

console.log(Vue.moment().locale()) //es



var VueCookie = require('vue-cookie');
Vue.use(VueCookie);

const options = {
  name: '_blank',
  specs: [
    'fullscreen=yes',
    'titlebar=yes',
    'scrollbars=yes'
  ],
  styles: [
    'https://oil.asiazero.com/styleA4.css',
  ]
}
// or, using the defaults with no stylesheet

Vue.use(VueHtmlToPaper, options);


Vue.use(ToggleButton)
Vue.use(VueImg);
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')