import Vue from 'vue'
import Vuex from 'vuex'

import state from './state'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

import common from './module/common'
import buildingList from './module/buildingList'
import projectList from './module/projectList'
Vue.use(Vuex)


export default new Vuex.Store({
	state,
	actions,
	mutations,
	getters,
	modules: {
		common,
    buildingList,
    projectList,
	}
})
