import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import category from './modules/category'
import customer from './modules/customer'
import designer from './modules/designer'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    category,
    customer,
    designer
  },
  getters
})

export default store
