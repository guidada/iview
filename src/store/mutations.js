const mutations  = {
	setCurrentNavs: (state, {navTitle, itemTitle})=>{
		state.currentNavs = []
		state.currentNavs.push(navTitle, itemTitle)
	},
	setUserInfo:(state, data)=>{
		state.userInfo = data
	}
}

export default mutations;