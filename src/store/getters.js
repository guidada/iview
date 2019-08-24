const getters  = {
	getIsLogin: (state)=>{
		return state.userInfo.id ? true : false
	},
	getUserInfo: (state)=>{
		return state.userInfo
	}
}

export default getters;