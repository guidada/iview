const state = {
  buildingList: [],
  currentBuildingInfo:{},
  currentBuildingInfoList:[]
}
const getters = {
	getBuildingList: (state) => {
		return state.buildingList
	},
  getCurrentBuildingInfo: (state) => {
    return state.currentBuildingInfo
  },
}
const actions = {

}
const mutations = {
	setBuildingList: (state, buildingList) => {
		state.buildingList = buildingList
	},
  setCurrentBuildingInfo: (state, currentBuildingInfo) => {
		// console.log( 'store',currentBuildingInfo)
		// if(state.currentBuildingInfoList.length===0){
		// 	console.log('数组为空',state.currentBuildingInfoList)
		// 	state.currentBuildingInfoList.push(currentBuildingInfo)
		// }
		// console.log('数组内容',state.currentBuildingInfoList)
     state.currentBuildingInfo = currentBuildingInfo
  },
}

export default {
	state,
	getters,
	actions,
	mutations
}
