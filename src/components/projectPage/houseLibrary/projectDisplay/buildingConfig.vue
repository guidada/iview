<template>
	<div class="building_config_container">
		<h2 class="header">定位配置</h2>
		<!-- <p class="tips">温馨提示：点击标签按钮，点击编辑，即可移动标签（标签尾部蓝色部分可拖拽）</p>
		<p class="tips">一次只能移动一个标签，请在把标签移动到需要的位置后及时保存，否则定位数据将可能丢失</p> -->
		<!--主体区域-->
		<div style="width: 780px;margin-bottom:20px;display: flex;justify-content: center;">
			<Button type="info" @click="saveXY">保存</Button>
			<Button style="margin-left: 20px" @click="goback">返回</Button>
		</div>
		<div class="content">
			<div class="building_img_wrap" :style="projectAvatar">
				<dragItem @setXY='setXY' :dragInfo="item" v-for="(item,index) in buildingInfoList" :key="index" :config_ing="config_ing"
				 style="padding: 0 10px 0 0;">
					<!-- <Poptip :title="item.building_num + '#'" word-wrap width="50" placement="right"> -->
						<!-- <Button>{{item.building_num}}#</Button> -->
						<!-- <div slot="content">
							<Button type="info" @click="editBuildingPosition(item)">编辑{{item.building_num}}#楼</Button>
						</div> -->
						<!-- <div class='arrow_box'>
						<h3>{{item.building_num}}#</h3>
						</div> -->
					<!-- </Poptip> -->
				</dragItem>
			</div>
			<!--相关操作区域-->
			<!-- <div style="margin-left: 20px"> -->
				<!-- <Form :model="currentBuildingInfo" label-position="left" :label-width="80"> -->
					<!-- <FormItem label="楼栋名称">
						<Input v-model="currentBuildingInfo.name" placeholder="请选择需要定位的楼栋" disabled></Input>
					</FormItem> -->
					<!-- <FormItem label="水平定位">
						<InputNumber :max="800" :min="1" v-model="currentBuildingInfo.left" disabled></InputNumber> -->
						<!--<span>可输入1-800数字</span>-->
					<!-- </FormItem>
					<FormItem label="垂直定位">
						<InputNumber :max="500" :min="1" v-model="currentBuildingInfo.top" disabled></InputNumber> -->
						<!--<span>可输入1-500数字</span>-->
					<!-- </FormItem> -->
					<!-- <FormItem label="楼栋简介">
             <Input type="textarea" :maxlength="60" v-model="currentBuildingInfo.desc" placeholder="请输入楼栋简介"></Input>
           </FormItem>-->
					<!-- <FormItem> -->
						<!-- <Button type="info" @click="submitPosition">保存</Button>
						<Button style="margin-left: 20px" @click="goback">返回</Button> -->
					<!-- </FormItem> -->
				<!-- </Form> -->
			<!-- </div> -->
			
		</div>
		
	</div>
</template>

<script>
	import dragItem from '@/components/common/dragItem/dragItem'
	import {
		mapGetters
	} from 'vuex'

	export default {
		name: "buildingConfig",
		data() {
			return {
				// 当前的楼栋编辑的楼栋信息
				currentBuildingInfo: {
					name: '',
					id: null,
					left: 0,
					top: 0,
					desc: '',
					dragAble: false
				},
				// 是否编辑
				isEdit: false,
				xyList: []
			}
		},
		props: ['buildingInfoList', 'config_ing', 'projectAvatar'],
		created() {
			// console.log('获取数据',this.getCurrentProjectInfo)
			var list = this.buildingInfoList
			list.forEach(item => {
				item.dragAble = true
				item.left = parseInt(item.left)
				item.top = parseInt(item.top)
			})
			this.buildingInfoList = list
		},
		components: {
			dragItem,
		},
		computed: {
			...mapGetters({
				getCurrentProjectInfo: 'getCurrentProjectInfo'
			})
		},
		methods: {
			goback() {
				this.$emit('cancelConfigBuildingPosition')
			},
			/*
			 * 编辑楼栋定位 按钮，开发楼栋编辑功能
			 * */
			editBuildingPosition(data) {
				var list = this.buildingInfoList
				list.forEach(item => {
					item.dragAble = true
					item.left = parseInt(item.left)
					item.top = parseInt(item.top)
				})
				this.buildingInfoList = list

				var res = data
				res.name = data.building_num + '#楼'
				res.dragAble = true
				this.currentBuildingInfo = res
				this.$Message.success('当前选中了' + res.name)
			},
			/*
			 *  提交楼栋定位到服务器
			 * */
			submitPosition() {
				var currentBuildingInfo = this.currentBuildingInfo
				this.$post('/building/fixedPosition', currentBuildingInfo).then(res => {
					if (res.data === '没有权限') {
						this.$Modal.error({
							title: '警告',
							content: '没有权限'
						})
						return false
					}
					if (res.status_code !== 200) return this.$Message.error('楼栋定位失败！')
					this.$Message.success('楼栋定位成功！')
					
					// console.log(res)
					currentBuildingInfo.dragAble = false
					this.currentBuildingInfo = currentBuildingInfo
				}).catch(err => {
					this.$Message.error('楼栋定位失败！')
					console.log(err)
				})
			},
			/* 
			*获取每个楼栋移动后的坐标 
			*  */
			setXY(xyItem) {
				var info = {
					id:'',
					top:'',
					left:''
				}  //储存坐标信息
				var updateFlag = 0 //坐标更新标志，如果更新了坐标就++,如果是新坐标就不变
				if (this.xyList.length === 0) {	//如果坐标列表长度为0，就直接插入新坐标
					info.id = xyItem.id
					info.top = xyItem.top
					info.left = xyItem.left
					this.xyList.push(info)
				} else {
					for (var i = 0; i < this.xyList.length; i++) {
						if (this.xyList[i].id === xyItem.id) {//如果不是第一次移动的坐标就覆盖上上一次移动后的坐标
							this.xyList[i].top = xyItem.top
							this.xyList[i].left = xyItem.left
							updateFlag++
						}
						if (this.xyList.length === i + 1 && updateFlag === 0) {//循环到底部，如果坐标更新标志未改变，则为新坐标，直接插入
							console.log('新楼坐标')
							info.id = xyItem.id
							info.top = xyItem.top
							info.left = xyItem.left
							this.xyList.push(info)
						}
					}
				}
				console.log('xylist', this.xyList)
			},
			//保存更改坐标
			saveXY() {
					//传info
					var info = this.xyList
					console.log('参数',info)
					this.$post('/building/fixedPosition',{'info':info}).then(res => {
						if (res.data === '没有权限') {
							this.$Modal.error({
								title: '警告',
								content: '没有权限'
							})
							return false
						}
						if (res.status_code !== 200) return this.$Message.error('楼栋定位失败！')
						this.$Message.success('楼栋定位成功！')
						this.$emit('cancelConfigBuildingPosition')
						console.log(res)
					}).catch(err => {
						this.$Message.error('楼栋定位失败！')
						console.log(err)
					})
			}
		},
	}
</script>

<style lang="less" scoped>
	.building_config_container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.header {
			font-size: 20px;
			font-weight: bolder;
			margin: 20px 0 30px;
		}

		.content {
			width: 100%;
			display: flex;
			justify-content: center;

			.building_img_wrap {
				position: relative;
				width: 800px;
				min-width: 800px;
				height: 500px;
				border: 1px solid #aaa;
				background: #ccc no-repeat center/contain;
				/*overflow: hidden;*/
			}
		}

		.tips {
			margin-bottom: 20px;
			color: #aaaaaa;
		}
		.arrow_box {
			position: relative;
			width: 50px;
			height: 25px;
			background: rgba(173,24,31,0.8);
			color: #fff;
			border-radius: 4px;
			text-align: center;
		}
		.arrow_box:after {
			top: 100%;
			left: 50%;
			border: solid transparent;
			content: " ";
			height: 0;
			width: 0;
			position: absolute;
			pointer-events: none;
			border-color: rgba(132, 197, 213, 0);
			border-top-color: rgba(173,24,31,0.8);
			border-width: 10px;
			margin-left: -10px;
		}
	}
</style>
