const state = {
  currentNavs: [],
  currentSubItem: ''
}
const getters = {
  getCurrentNavs: (state) => {
    return state.currentNavs
  },
  getCurrentSubItem: (state) => {
    return state.currentSubItem
  }
}
const actions = {}
const mutations = {
  setCurrentNavs: (state, navs) => {
    state.currentNavs = navs
  },
  setCurrentSubItem: (state, subItem) => {
    state.currentSubItem = subItem
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
