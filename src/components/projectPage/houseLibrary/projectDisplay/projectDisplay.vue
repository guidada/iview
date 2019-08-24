<template>
  <div class="project_display_container">
    <!--配置了鸟瞰图的情况-->
    <div v-if="projectInfo.building_avatar && !isConfigPosition" class="content">
      <div class="header">{{projectInfo.name}}</div>
      <div style="width: 780px;margin-bottom:20px;display: flex;justify-content: center;">
        <Button type="warning" @click="gotoConfigePosition">配置楼栋定位</Button>
        <Button type="info" @click="gotoAddBuilding" style="margin-left: 20px">前往新增楼栋</Button>
      </div>
      <div class="building_img_wrap" :style="projectAvatar">
        <dragItem :dragInfo="item" v-for="(item,index) in buildingInfoList" :key="index" style="padding: 0;" @click='gotoBuildingInfoPage(item.id)'>
          <!-- <Poptip :title="item.name"
                  word-wrap
                  width="50"
									popper-class='poptip'
                  placement="bottom"> -->
            <Button @click='gotoBuildingInfoPage(item.id)' style="position: relative;bottom:25px;width: 50px;height: 25px;opacity: 0;"></Button>
            <!-- <div class='arrow_box'> -->
            <!-- <h3>{{item.building_num}}#</h3> -->
									<!-- </div> -->
						<div slot="content">
              <div style="padding: 5px 0"><span style="font-weight: bold">楼栋描述：</span>{{item.desc || '暂无描述'}}</div>
              <Button type="info" @click="gotoBuildingInfoPage(item.id)">前往{{item.building_num}}#楼详情</Button>
            </div>
          </Poptip>
        </dragItem>
      </div>
      /'
    </div>
    <!--未配置鸟瞰图的情况-->
    <div v-if="!projectInfo.building_avatar" class="content">
      <img src="@/assets/images/projectPage/u1110.png" alt="">
      <span style="margin: 20px 0">未配置鸟瞰图</span>
      <Button type="info" @click="gotoConfigeAvatar">前去配置</Button>
    </div>
    <!-- 配置中-->
    <div class="config_wrap">
      <buildingConfig
        v-if="isConfigPosition"
        :buildingInfoList="buildingInfoList"
        :projectAvatar="projectAvatar"
        :config_ing=true
        @cancelConfigBuildingPosition="cancelConfigBuildingPosition"
      ></buildingConfig>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import dragItem from '@/components/common/dragItem/dragItem'
  import buildingConfig from './buildingConfig'

  export default {
    name: "projectDisplay",
    data() {
      return {
        // 楼栋列表
        buildingInfoList: [],
        // 当前项目的基本信息
        projectInfo: {},
        // 是否配置定位
        isConfigPosition: false,
        projectAvatar:{
          // backgroundImage: "url("+ projectInfo.building_avatar +")"
        }
      }
    },
    computed: {
      ...mapGetters({
        getCurrentProjectInfo: 'getCurrentProjectInfo'
      })
    },
    components: {
      dragItem,
      buildingConfig,
    },
    created() {
      this.getProjectInfo(parseInt(this.$route.params.id))
      this.getBuildingList(parseInt(this.$route.params.id))
    },
    methods: {
      /*
      *  获取到当前项目的信息
      * */
      getProjectInfo(id) {
        this.$post('/project/lists').then(res=>{
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          if (res.status_code!==200) return this.$Message.error('获取项目信息失败！')
          var result = res.data.project
          this.projectInfo = result.find(item=>{
            return item.id === id
          })
          // console.log('projectInfo',this.projectInfo)
          this.projectAvatar = {
            backgroundImage: `url('${this.projectInfo.building_avatar}')`
          }
        }).catch(err=>{
          this.$Message.error('获取项目信息失败！')
        })
      },
      /*
     * 获取到项目的楼栋列表
     * */
      getBuildingList(id) {
        this.$post('/building/lists', {project_id: id}).then(res => {
          if (res.status_code !== 200) return this.$Message.error('获取楼栋列表失败！')
          var result = res.data.building
          var count = 0
          result.forEach((item, index) => {
            if (!parseFloat(item.top)) {
              item.top = 35 * count + 1
              count++
            }
            if (!parseFloat(item.left)) {
              item.left = 5
            }
          })
          this.buildingInfoList = result
          
					console.log('格式化之后的楼栋列表', this.buildingInfoList)
        }).catch(err => {
          this.$Message.error('获取楼栋列表失败！')
          // console.log(err)
        })
      },
      /*
      * 去配置页面鸟瞰图
      * */
      gotoConfigeAvatar() {
        this.$router.push({
          path: '/project/' + this.$route.params.id + '/houseLibrary/editProject'
        })
      },
      /*
      * 去添加楼栋
      * */
      gotoAddBuilding() {
        this.$router.push({
          path: '/project/' + this.$route.params.id + '/houseLibrary/houseManagement'
        })
      },
      /*
      * 去配置楼栋定位
      * */
      gotoConfigePosition() {
        if (this.buildingInfoList.leng === 0) return this.$Message.error('当前项目暂无楼栋，请添加楼栋')
        this.isConfigPosition = true
      },
      /*
      * 取消配置楼栋定位
      * */
      cancelConfigBuildingPosition() {
				console.log('返回了')
        this.isConfigPosition = false
      },
      /*
      *  跳转到楼栋详情页面
      * */
      gotoBuildingInfoPage(id) {
        this.$router.push({
          path: '/project/' + this.$route.params.id + '/houseLibrary/houseManagement/' + id
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .project_display_container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .content {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      overflow: hidden;

      .header {
        font-size: 20px;
        font-weight: bolder;
        margin: 20px 0 30px;
      }

      .building_img_wrap {
        position: relative;
				display: flex;
				flex-wrap:wrap;
        width: 800px;
        height: 500px;
        border: 1px solid #aaa;
        background: #ccc  no-repeat center/contain
        /*url('https://images.fangbee.cn/1/photos/1e59acebf4b89f86b2520e757d4094a9filejpg')*/
      }

    }

    .tips {
      font-size: 12px;
      color: #ff0307;
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
