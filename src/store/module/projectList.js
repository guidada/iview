const state = {
  projectList: [],
  currentProjectInfo: {},
  projectId:null,
}
const getters = {
  getProjectList: (state) => {
    return state.projectList
  },
  getCurrentProjectInfo: (state) => {
    return state.currentProjectInfo
  },
}
const actions = {}
const mutations = {
  setProjectList: (state, projectList) => {
    state.projectList = projectList
  },
  setCurrentProjectInfo: (state, id) => {
    state.currentProjectInfo = state.projectList.find(item => {
      return parseInt(item.id) === parseInt(id)
    })

  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
