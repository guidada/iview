<template>
	<!--主页面-->
	<Layout class="house_management_container" style="height: 100%;border: 1px solid #cccccc;position: relative">
		<Sider :collapsed-width="78" style="background-color: #ffffff;border-right: 1px solid #cccccc">
			<!--logo-->
			<Header style="background-color: #ffffff;border-bottom: 1px solid #cccccc;height: 150px">
				<div class="logo_wrap">
					<h2>{{currentProjectInfo.name}}</h2>
					<img :src="currentProjectInfo.avatar">
				</div>
			</Header>
			<!--楼栋列表-->
			<div class="building_list">
				<!--新增按钮-->
				<div class="building_item">
					<Button type="primary" @click="gotoAddBuilding">新增楼栋</Button>
				</div>
				<!--新增楼栋的编辑框-->
				<div class="add_building_form" v-if="isAddBuilding">
					<InputNumber style="margin: 15px 0;width: 100%" :min="1" v-model="buildingNum" placeholder="请输入楼栋号(数字)"></InputNumber>
					<div class="btn_wrap">
						<Button type="info" @click="addBuilding" style="margin: 0 9px">确认</Button>
						<Button @click="cancelAddBuilding">取消</Button>
					</div>
				</div>
				<!--列表项-->
				<div v-for="(item,index) in buildingList" :key="item.id" @click="getHouseList(item)" :class="['building_item',{'active':currentBuildingNum===item.building_num}]">
					<Tooltip placement="right">
						<span>{{item.building_num}}幢楼</span>
						<div slot="content" style="cursor: pointer" @click="gotoEditBuilding(item)">
							<Icon type="ios-create-outline" size="20" />
							编辑
						</div>
						<div slot="content" style="cursor: pointer" @click="deleteBuilding(item)">
							<Icon type="ios-trash-outline" size="20" />
							删除
						</div>
					</Tooltip>
				</div>
			</div>
		</Sider>
		<Layout>
			<!--颜色展示-->
			<Header style="background-color: #ffffff;border-bottom: 1px solid #cccccc;height: 150px;line-height: 35px;">
				<div class="header_wrap">
					<h2 class="header_text">{{currentBuildingInfo.building_num ? currentBuildingInfo.building_num + '幢楼' :
            '暂未选择楼栋'}}</h2>
					<!--房子的销售状态颜色-->
					<div class="color_wrap">
						<div class="color_item" v-for="(item,index) in colorList" :key="index">
							<span class="color_box" :style="{backgroundColor:item.color}"></span>
							<span style="width: 80px;">{{item.name}}({{item.count}})</span>
						</div>
					</div>
				</div>
			</Header>
			<!--表格展示区-->
			<Content style="background-color: #ffffff;padding: 30px" v-if="buildingList.length && currentBuildingInfo.building_num">
				<div class="btn_wrap">
					<!-- <Button type="primary" style="margin-right: 20px" @click="goToAddHouse">添加房源</Button> -->
					<Button type="primary" @click="gotoUploadExcel">
						<Icon type="ios-cloud-upload-outline" size="16" style="margin-right: 5px" />
						<span>导入数据</span>
					</Button>
				</div>
				<div class="table_wrap">
					<houseTable :colorList="colorList" :houseList="currentHouseList" :buildingInfo="currentBuildingInfo"
					 @goToEditHouse="goToEditHouse"></houseTable>
				</div>
			</Content>
			<Content style="background-color: #ffffff;padding: 30px" v-else>
				<div style="text-align: center;color: #aaaaaa;font-size: 16px">{{noDataText?noDataText:'暂无数据'}}</div>
			</Content>
		</Layout>
		<!--导入数据 弹窗-->
		<!-- <div v-if="isUploadExcel" class="modal_wrap">
			<uploadExcel @cancelUpload="cancelUpload" :currentBuildingInfo="currentBuildingInfo"></uploadExcel>
		</div> -->
		<div v-if="isUploadExcel">
		<Modal v-model="isUploadExcel" width="932" :footer-hide='true'>
			<uploadExcel @cancelUpload="cancelUpload" :currentBuildingInfo="currentBuildingInfo"></uploadExcel>
		</Modal>
		</div>
		<!--编辑楼栋 弹窗-->
		<div v-if="isEditBuilding">
			<Modal v-model='isEditBuilding'  width="932" :footer-hide='true'>
			<addBuilding :editBuildingInfo="editBuildingInfo" @cancelEditBuilding="cancelEditBuilding" @editBuildingSuccess="editBuildingSuccess"></addBuilding>
			</Modal>
		</div>
		<!--编辑房源 弹窗 -->
		<div v-if="isEditHouse" >
			<Modal v-model="isEditHouse" width="932" :footer-hide='true'>
			<editHouse @cancelEditHouse="cancelEditHouse" :currentBuildingInfo="currentBuildingInfo" :editHouseInfo="editHouseInfo"
			 :isForbid="isForbid"></editHouse>
			 </Modal>
		</div>
		
	</Layout>
</template>

<script>
	import houseTable from './houseTable'
	import uploadExcel from './uploadExcel'
	import addBuilding from './buildings/addBuilding'
	import editHouse from './house/index'

	export default {
		name: "houseManagement",
		data() {
			return {
				// 是否导入数据
				isUploadExcel: false,
				// 是否添加楼栋
				isAddBuilding: false,
				// 要添加的楼栋号
				buildingNum: null,
				// 是否编辑楼栋
				isEditBuilding: false,
				// 要编辑的楼栋的信息
				editBuildingInfo: {},
				// 是否编辑房源
				isEditHouse: false,
				// 销售状态的颜色列表
				// 添加数量指标 
				colorList: [{
						name: '他售',
						color: '#E4E4E4',
						count: 0
					},
					{
						name: '内部锁定',
						color: '#9CADD8',
						count: 0
					},
					{
						name: '在售',
						color: '#84D184',
						count: 0
					},
					{
						name: '规外',
						color: '#A6C46E',
						count: 0
					},
					{
						name: '待售',
						color: '#ffffff',
						count: 0
					},
					{
						name: '认筹中',
						color: '#FFCD95',
						count: 0
					},
					{
						name: '已认购',
						color: '#FFCE00',
						count: 0
					},
					{
						name: '签约中',
						color: '#FA7946',
						count: 0
					},
					{
						name: '已签约',
						color: '#DBBE67',
						count: 0
					},
					{
						name: '回款',
						color: '#FBAEAD',
						count: 0
					},
					{
						name: '交房',
						color: '#BAE0E0',
						count: 0
					},
					{
						name: '办证',
						color: '#CDCE00',
						count: 0
					},
					{
						name: '已完结',
						color: '#A6D4AE',
						count: 0
					},
				],
				// 当前项目的信息
				currentProjectInfo: {},
				// 楼栋列表
				buildingList: [],
				// 当前楼栋信息
				currentBuildingInfo: {},
				// 当前的楼栋号
				currentBuildingNum: null,
				// 当前项目的所有房源
				allHouseList: [],
				// 当前楼栋的房源
				currentHouseList: [],
				// 当前要编辑的房源
				editHouseInfo: {},
				// 楼栋id
				buildId: parseInt(this.$route.params.build) || null,
				isForbid: false,
				noDataText: '暂无数据',
			}
		},
		created() {
			this.getCurrentProjectBuildingAndHouse(parseInt(this.$route.params.id), this.buildId)
			this.getBuildingList(parseInt(this.$route.params.id))
		},
		components: {
			houseTable,
			uploadExcel,
			addBuilding,
			editHouse,
		},
		methods: {
			/*
			 * 获取都当前项目的所有信息，项目信息，楼栋信息，房源信息
			 * */
			getCurrentProjectBuildingAndHouse(id, buildId) {
				this.$post('/house/lists', {
					project_id: id
				}).then(res => {
					if (res.data === '没有权限') {
						this.noDataText = '没有权限'
						return false
					}
					if (res.status_code !== 200) return this.$Message.error('获取楼栋列表失败！')
					this.currentProjectInfo = res.data.building
					this.allHouseList = res.data.building.building
					console.log('所有房源信息=============', res.data.building)
					if (buildId) {
						//获取所点楼幢的信息
						var result = this.allHouseList.find(item => {
							return item.id === buildId
						})
						//获取点击楼幢的id
						this.currentBuildingNum = result.building_num
						// 将所有房源存放到一个统一的列表
						// 获取当前楼幢的房屋信息
						var houseList = []
						result.unit.forEach(item => {
							houseList = houseList.concat(item.house)
						})
						this.formatHouseList(houseList)
					}

				}).catch(err => {
					this.$Message.error('获取楼栋列表失败！')
					console.log(err)
				})
			},
			/*
			 * 获取到项目的楼栋列表
			 * */
			getBuildingList(id) {
				this.$post('/building/lists', {
					project_id: id
				}).then(res => {
					if (res.status_code !== 200) return this.$Message.error('获取楼栋列表失败！')
					if (res.data === '没有权限') {
						this.$Modal.error({
							title: '警告',
							content: '没有权限'
						})
						return false
					}
					var result = res.data.building
					if (result.length) {
						result.forEach(item => {
							item.mianji = item.mianji ? parseFloat(item.mianji) : null
							item.pay_time = item.pay_time ? item.pay_time : new Date()
							item.value_count = item.value_count ? parseFloat(item.value_count) : null
							item.property_type = item.property_type ? item.property_type.split(' ') : []
						})
						// this.currentBuildingInfo = result[0]
					} else {
						this.currentBuildingInfo = {}
					}
					this.buildingList = result
					// console.log('格式化之后的楼栋列表', this.buildingList)
					var buildId = parseInt(this.$route.params.build)
					if (buildId) {
						this.currentBuildingInfo = result.find(item => {
							return item.id === buildId
						})
					}
				}).catch(err => {
					this.$Message.error('获取楼栋列表失败！')
					// console.log(err)
				})
			},
			/*
			 * 打开添加楼栋的编辑框
			 * */
			gotoAddBuilding() {
				this.isAddBuilding = true
			},
			/*
			 * 关闭添加楼栋的编辑框
			 * */
			cancelAddBuilding() {
				this.isAddBuilding = false
			},
			/*
			 * 添加楼栋
			 * */
			addBuilding() {
				if (!this.buildingNum) return this.$Message.error('楼栋号不能为空！')
				this.$post('/building/addBuilding', {
					project_id: parseInt(this.$route.params.id),
					building_num: this.buildingNum
				}).then(res => {
					if (res.data === '没有权限') {
						this.$Modal.error({
							title: '警告',
							content: '没有权限'
						})
						return false
					}
					if (res.status_code !== 200) return this.$Message.error('添加楼栋失败！')
					if (res.data === '添加的楼栋号已存在') return this.$Message.error('添加的楼栋号已存在！')
					this.$Message.success('添加楼栋成功！')
					this.getBuildingList(parseInt(this.$route.params.id))
					// console.log('新添加的楼栋=====',res)
					// this.buildingList.unshift(res.data)
					this.isAddBuilding = false
				}).catch(err => {
					this.$Message.error('添加楼栋失败！')
				})
			},
			/*
			 * 去编辑楼栋信息，并把当前的楼栋信息记录下来
			 * */
			gotoEditBuilding(data) {
				console.log('去编辑楼栋', data)
				this.editBuildingInfo = data
				this.isEditBuilding = true
			},
			/*
			 * 取消编辑楼栋信息
			 * */
			cancelEditBuilding() {
				this.isEditBuilding = false
			},
			/*
			 * 编辑成功后把数据临时添加到楼栋列表内
			 * */
			editBuildingSuccess(res) {
				// console.log('来自子组件编辑的结果', res)
				var list = this.buildingList
				list.forEach((item, index) => {
					if (item.id === res.id) {
						list[index] = res
					}
				})
				this.buildingList = list
				this.getCurrentProjectBuildingAndHouse(parseInt(this.$route.params.id), res.id)
				setTimeout(() => {
					this.isEditBuilding = false
				}, 500)
			},
			/*
			 * 导入数据
			 * */
			gotoUploadExcel() {
				// console.log('导入数据', this.currentBuildingInfo)
				this.isUploadExcel = true
			},
			cancelUpload() {
				this.isUploadExcel = false
			},
			/*
			 *  获取指定楼栋的房源列表
			 * */
			getHouseList(data) {
				this.$router.push({
					path: '/project/' + this.$route.params.id + '/houseLibrary/houseManagement/' + data.id
				})
				this.currentBuildingInfo = data
				this.currentBuildingNum = data.building_num
				// console.log('currentBuildingInfo====',data)
				this.getCurrentProjectBuildingAndHouse(data.project_id)
				// 找到当前楼栋的数据
				var result = this.allHouseList.find(item => {
					return item.id === data.id
				})
				// 将所有房源存放到一个统一的列表
				var houseList = []
				result.unit.forEach(item => {
					houseList = houseList.concat(item.house)
				})
				this.formatHouseList(houseList)
			},
			/*
			 *  房源列表进行格式转换
			 * */
			formatHouseList(list) {
				var totalFloor = 0
				//初始化颜色统计
				this.colorList.forEach(c => {
					c.count = 0;
				})
				// 根据状态添加颜色,统计不同颜色数量,并找出最大楼层
				list.forEach(item => {
					if (item.in_floor > totalFloor) {
						totalFloor = item.in_floor
					}
					// console.log('item',item)
					this.colorList.forEach(c => {
						if (item.state === c.name) {
							item.color = c.color
							if(item.house_num !== '-'){
								c.count++
							}
							
						}
					})
				})
				// 创建一个楼层列表
				var result = []
				for (var i = totalFloor; i > 0; i--) {
					result.push({
						floor: i,
						house: []
					})
				}
				// 把同一楼层的数据放到一个对象内
				list.forEach(item => {
					result.forEach((res, index) => {
						if (item.in_floor === res.floor) {
							res.house.push(item)
						}
					})
				})
				this.currentHouseList = result
			},
			/*
			 *  编辑房源
			 * */
			goToEditHouse(res) {
				console.log('要编辑的房源res', res)
				var stateList = ['待售', '在售', '规外', '内部锁定', '他售']
				if (stateList.indexOf(res.state) === -1) {
					// return this.$Message.error('该房源当前状态为' + res.state + ',暂时不可编辑！')
					this.isForbid = true
				} else {
					this.isForbid = false
				}
				this.editHouseInfo = res
				if (this.editHouseInfo.id) {
					this.$http.post('/house/oneHouse', {
							house_id: this.editHouseInfo.id
						})
						.then(res => {
							console.log('editHouseInfoeeee', res.data.data)

							if (res.status !== 200) {
								return this.$Message.error('获取房屋信息数据失败！')
							}
							this.editHouseInfo = res.data.data.house
							console.log('123')
							this.isMain = true
							// this.$Message.success('获取房屋信息数据成功！')
						}).catch(err => {
							this.$Message.error('获取房屋信息数据失败！')
							console.log('错误信息', err)
						})
				}
				this.isEditHouse = true
			},
			/*
			 * 添加房源
			 * */
			goToAddHouse() {
				this.editHouseInfo = {}
				this.isEditHouse = true
			},
			/*
			 * 取消编辑房源
			 * */
			cancelEditHouse() {
				this.isEditHouse = false
			},
			/* 
			 * 删除楼幢
			 *  */
			deleteBuilding(building) {
				console.log('building', building)
				this.$post('/building/deleteBuilding', {
					id: building.id
				}).then(res => {
					if (res.data === '没有权限') {
						this.noDataText = '没有权限'
						return false
					}
					if (res.data === '楼栋删除成功') {
						this.getBuildingList(parseInt(this.$route.params.id))
					}
					console.log('buildingRes', res)
					this.$Message.info(res.data)
					this.$router.push('houseManagement/')

				}).catch(err => {
					this.$Message.error('获取楼栋列表失败！')
					console.log(err)
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.house_management_container {
		.logo_wrap {
			width: 100%;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;

			h2 {
				font-size: 18px;
				width: 150%;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				text-align: center;
			}

			img {
				width: 50px;
				height: 50px;
				border-radius: 50%;
			}
		}

		.building_list {
			width: 100%;

			.building_item {
				font-size: 16px;
				text-align: center;
				/*margin-top: 30px;*/
				cursor: pointer;
				padding: 15px 0;

				&:hover {
					background-color: #dddddd;
					color: #348EED;
					box-shadow: 0 1px 5px #aaaaaa;
				}

			}

			.active {
				background-color: #dddddd;
				color: #348EED;
				box-shadow: 0 1px 5px #aaaaaa;
			}

			.add_building_form {
				display: flex;
				flex-direction: column;
				justify-content: center;
				padding: 0 20px;

				.btn_wrap {
					display: flex;
					justify-content: space-around;
				}
			}
		}

		.header_wrap {

			.header_text {
				margin-right: 100px;
				font-size: 20px;
				font-weight: bolder;
				line-height: 45px;
			}

			.color_wrap {
				width: 100%;
				display: flex;
				justify-content: flex-start;
				flex-wrap: wrap;

				.color_item {
					margin-left: 10px;
					width: 150px;
					display: flex;
					justify-content: flex-start;
					align-items: center;

					.color_box {
						display: inline-block;
						width: 30px;
						height: 20px;
						border: 1px solid black;
						margin-right: 9px;
					}
				}
			}
		}

		.table_wrap {
			padding: 30px 0;
		}

		.modal_wrap {
			position: absolute;
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, .5);
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>
