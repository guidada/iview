<template>
  <!--照片盒子，添加项目基本信息时使用，一次只能添加一张图片-->
  <div v-if="isAddPic" class="pic_box">
    <photosBox
      style="padding: 0 20px"
      :toSelect="true"
      :count="1"
      @canclePhotos="closePicBox"
      @addPhotos="addPhotos"
    ></photosBox>
  </div>
  <!--添加图集列表时使用，一次可添加多张图片-->
  <div v-else-if="isAddGroupInnerPic" class="pic_box">
    <photosBox
      style="padding: 0 20px"
      :toSelect="true"
      :count="10"
      @canclePhotos="closeGroupPicBox"
      @addPhotos="addGroupInnerPic"
    ></photosBox>
  </div>
  <!--主体内容-->
  <div v-else class="add_project_container">
    <Tabs type="card" :value="currentTab">
      <TabPane label="项目信息" name="baseInfo">
        <!--:rules="projectRules"-->
        <Form class="form" ref="projectForm" :model="projectInfo" :rules="projectRules" :label-width="100">
          <!-- 项目名称 -->
          <Row>
            <Col span="11">
              <FormItem label="项目名称：" prop="name">
                <Input v-model="projectInfo.name" placeholder="请输入项目的名称"></Input>
              </FormItem>
            </Col>
          </Row>
          <!-- 项目别名 -->
          <Row>
            <Col span="11">
              <FormItem label="项目别名：">
                <Input v-model="projectInfo.nickname" placeholder="请输入项目的别名"></Input>
              </FormItem>
            </Col>
          </Row>
          <!-- 项目所在区域 -->
          <Row>
            <Col span="11">
              <FormItem label="项目地址：" prop="area">
                <!--  <Select v-model="project.province" placeholder="省份">
                    <Option v-for="(item, index) in provinceList" :value="item.name" :key="index">{{item.name}}</Option>
                  </Select>-->
                <Cascader :data="areaList" v-model="area"></Cascader>
              </FormItem>
            </Col>
          </Row>
          <!-- 项目所在详细地址 -->
          <Row>
            <Col span="11">
              <FormItem label="详细地址：">
                <Input v-model="projectInfo.address" placeholder="请输入项目的详细地址"></Input>
              </FormItem>
            </Col>
          </Row>
          <!--类型-->
          <Row>
            <Col span="11">
              <FormItem label="类型：" prop="type">
                <CheckboxGroup v-model="projectInfo.type">
                  <Checkbox label="别墅"></Checkbox>
                  <Checkbox label="住宅"></Checkbox>
                  <Checkbox label="商铺"></Checkbox>
                  <Checkbox label="公寓"></Checkbox>
                  <Checkbox label="写字楼"></Checkbox>
                </CheckboxGroup>
              </FormItem>
            </Col>
          </Row>
          <!-- 项目介绍 -->
          <Row>
            <Col span="11">
              <FormItem label="项目介绍：">
                <Input v-model="projectInfo.desc" placeholder="请输入项目介绍" type="textarea"></Input>
              </FormItem>
            </Col>
          </Row>
          <!--总套数-->
          <Row>
            <Col span="11">
              <FormItem label="总套数：">
                <Input v-model="projectInfo.house_count" placeholder="不可编辑，系统根据实际上传房源数据计算得出" disabled
                ></Input>
              </FormItem>
            </Col>
          </Row>
          <!--总栋数-->
          <Row>
            <Col span="11">
              <FormItem label="楼栋数：">
                <Input v-model="projectInfo.building_count" placeholder="不可编辑，系统根据实际标注楼栋数据计算得出" disabled
                ></Input>
              </FormItem>
            </Col>
          </Row>
          <!--上传项目鸟瞰图-->
          <!-- <Row>
             <Col offset="1">
               <div style="color: #348EED" @click="showMarkWrap">标注楼栋位置</div>
             </Col>
           </Row>-->
          <Row>
            <Col span="5">
              <FormItem label="项目鸟瞰图：">
                <Button
                  style="padding: 5px 30px;background-color: #348EED; color: white"
                  @click="openPicBox"
                >上传
                </Button>
              </FormItem>
            </Col>
            <Col span="10">
              <div class="logo_icon_warp" style="width: 400px;height: 250px">
                <img v-if="projectInfo.building_avatar" :src="projectInfo.building_avatar" width="100%">
                <span v-else>未选择鸟瞰图</span>
              </div>
            </Col>
            <Col span="6">
              <div class="logo_icon_tips">
                建议尺寸为800*500 ，2M以内
              </div>
            </Col>
          </Row>

          <hr style="margin: 50px 0"/>

          <!--上传图标 logo-->
          <Row>
            <Col span="5">
              <FormItem label="LOGO：">
                <Button
                  style="padding: 5px 30px;background-color: #348EED; color: white"
                  @click="openPicBox"
                  id="logo"
                >上传
                </Button>
              </FormItem>
            </Col>
            <Col span="6">
              <div class="logo_icon_warp">
                <img v-if="projectInfo.avatar" :src="projectInfo.avatar" width="100%">
                <span v-else>未选择LOGO</span>
              </div>
            </Col>
            <Col span="6">
              <div class="logo_icon_tips">
                建议尺寸为250*200 ，1M以内
              </div>
            </Col>
          </Row>

          <!-- 按钮 -->
          <div class="btns">
            <Button type="success" @click="btnSubmit('projectForm')">保存</Button>
            <Button @click="goBack" class="goback">返回</Button>
          </div>
        </Form>
      </TabPane>
      <TabPane label="项目图库" v-if="!isAddProject" name="photos">
        <div class="photos_wrap" v-if="!isAddGroupPic">
          <div class="header">
            <span class="add_pics_btn" @click="addPicGroup">添加图集</span>
          </div>
          <div class="body">
            <Row :gutter="32">
              <Col :span="span" v-for="item in picGroup" :key="item.id" class="pic_item">
                <card class="pic_info">
                  <img :src="item.avatar?item.avatar:defaultGroupAvatar">
                  <Input
                    class="name"
                    type="text"
                    placeholder="输入图集名称"
                    :value="item.name"
                    @on-focus="showEditBtn(item.id,item.name)"
                    @on-keyup="recordName"
                  />
                  <p class="btn_wrap">
                    <span class="edit_btn">
                      <Button v-if="item.id===editGroupId" type="info" @click="eidtGroup(item.id)">确认修改</Button>
                    </span>
                    <Icon class="check_btn" type="ios-arrow-dropright" size="20"
                          @click="showGroupInnerPicList(item.id,item)"/>
                    <Icon class="del_btn" type="ios-trash-outline" size="20" @click="deleteGroup(item.id)"/>
                  </p>
                </card>
              </Col>
              <Col>
                <div v-if="picGroup.length===0" class="pic_group_tips">当前项目暂无图片集</div>
              </Col>
            </Row>
          </div>
        </div>
        <div class="add_pic_wrap" v-if="isAddGroupPic && !isShowSwiper">
          <div class="header">
            <div>
              <span style="color: #348EED">{{currentPicsInfo.name || '临时图集'}}</span>
              <span> / 添加图片</span>
            </div>
            <Button style="padding: 10px 35px; color: #666" @click="hideGroupInnerPicList">返回</Button>
          </div>
          <div class="body">
            <Row>
              <Col :span="span" v-for="(item,index) in currentPics" :key="item.id" class="pic_item">
                <Card class="pic_info">
                  <img :src="item.avatar" @click="showSwiper(index)">
                  <div class="del_btn"
                       style="text-align: right;margin-right: 10px;margin-top: 5px"
                       @click="deleteGroupInnerPic(item.id)"
                  >
                    <Icon type="ios-trash-outline" size="20" color="red" style="cursor: pointer"/>
                  </div>
                </Card>
              </Col>
              <Col :span="span" class="pic_item">
                <div class="add_group_inner_pic" @click="openGroupPicBox">
                  <Icon type="ios-add"/>
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <div class="swiper_box" v-if="isShowSwiper">
          <div class="header">
            <Breadcrumb style="font-size: 18px">
              <BreadcrumbItem style="color: #348EED">{{currentPicsInfo.name || '临时图集'}}</BreadcrumbItem>
              <BreadcrumbItem>图片列表</BreadcrumbItem>
            </Breadcrumb>
            <Button class="go_back" @click="isShowSwiper=false">返回</Button>
            <!--<Icon type="ios-close-circle-outline" size="40" @click="isShowSwiper=false"/>-->
          </div>
          <swiperBox :swiperList="currentPics" :currentPicIndex="currentPicIndex"></swiperBox>
        </div>
      </TabPane>
    </Tabs>

    <!--蒙版-->
    <div class="mengban" v-if="isMarker"></div>
    <!-- 标注楼栋-->
    <div class="mark_wrap" v-if="isMarker">
      <div class="header">
        <span>标注楼栋位置</span>
        <Upload v-model="projectInfo.marker" action="//jsonplaceholder.typicode.com/posts/">
          <div class="upload_btn">上传图片</div>
        </Upload>
        <div class="close" @click="closeMarkerWrap">关闭</div>
      </div>
      <div class="body">
        <span v-if="noPics">暂无图片</span>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  import areaList from '@/components/config/district.js'
  import photosBox from '@/components/common/upLoadPhotosList/photosBox'
  import swiperBox from '@/components/common/swiper/swiper'

  export default {
    // name: "addProject",
    data() {
      return {
        span: 4,
        screenWidth: document.body.clientWidth,
        currentTab: 'baseInfo',
        isAddProject: true,
        // 是否添加照片
        isAddPic: false,
        isAddLogo: false,
        //是否添加图片集照片
        isAddGroupPic: false,
        // 是否楼栋标注
        isMarker: false,
        noPics: true,
        projectInfo: {
          // id默认为空
          id: '',
          // 项目名称
          name: '',
          // 项目别名
          nickname: '',
          // 省份
          province: '',
          // 项目城市
          city: '',
          // 项目详细地址
          address: '',
          // 项目类型
          type: [],
          // 项目描述
          desc: '',
          // 楼栋数
          building_count: null,
          // 总套数
          house_count: null,
          // logo
          avatar: '',
          // 鸟瞰图
          building_avatar: '',
        },
        // 表单验证规则
        projectRules: {
          name: [{
            required: true,
            message: '项目名称不能为空',
            trigger: 'blur'
          }],
          area: [
            {
              required: true,
              type: 'array',
              validator(rule, value, callback) {
                var errors = []
                callback(errors)
              }
            }],
          type: [
            {
              required: true,
              type: 'array',
              validator(rule, value, callback) {
                var errors = []
                callback(errors)
              }
            }],
        },
        // 临时数组，存放项目地址数组，第一个是省份，第二个是城市，提交表单的时候把数组元素赋值到对应的参数
        area: [],
        // 省份和城市区域列表
        areaList: areaList,
        /*图集*/
        picGroup: [],
        // 图集的默认封面图片
        defaultGroupAvatar: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3197631341,4284763271&fm=26&gp=0.jpg',
        // 记录到的临时图集名字
        recordGroupName: '',
        // 编辑中的图集id
        editGroupId: null,
        //当前图集内容
        currentPics: [],
        // 当前图集的内容
        currentPicsInfo: {},
        // 是否添加图集内的图片列表
        isAddGroupInnerPic: false,
        // 是否已轮播图形式展示图片列表
        isShowSwiper: false,
        // 点击预览时的图片下标index
        currentPicIndex: 0
      }
    },
    created() {
      // 判断当前是否是添加项目
      this.isAddProject = this.$route.path.indexOf('addProject') !== -1
      // console.log('添加项目==',this.isAddProject)
      this.initSpan(this.screenWidth)
      // 如果不是添加项目的情况，执行一下的内容
      if (!this.isAddProject) {
        var id = this.$route.params.id ? parseInt(this.$route.params.id) : parseInt(localStorage.getItem('projectId'))
        this.getProjectInfoById(id)
        this.getAllPicGroup(id)
      }
    },
    methods: {
      /*
      * 区域格式化成需要的格式
      * */
      areaFormat() {
        let area = this.area
        // console.log('格式化之前的区域数据',area)
        let result = []
        if (area.length) {
          areaList.forEach(province => {
            if (province.value == area[0]) {
              province.children.forEach(city => {
                if (city.value == area[1]) {
                  city.children.forEach(district => {
                    if (district.value == area[2]) {
                      result = [province.label, city.label, district.label]
                    }
                  })
                }
              })
            }
          })
        }
        // console.log('格式化之后的区域数据====',result)
        return result
      },
      /*
      * 如果是编辑的情况，初始化服务器获取到的区域
      * */
      initArea(data) {
        var result = []
        this.areaList.forEach(province => {
          if (province.label == data.province) {
            var provinceValue = province.value
            result = [provinceValue, '', '']
            province.children.forEach(city => {
              if (city.label == data.city) {
                var cityValue = city.value
                result = [provinceValue, cityValue, '']
                city.children.forEach(district => {
                  if (district.label == data.district) {
                    var districtValue = district.value
                    result = [provinceValue, cityValue, districtValue]
                  }
                })
              }
            })
          }
        })
        // console.log('初始化服务器获取到的区域===', result)
        this.area = result
      },
      openPicBox(e) {
        this.isAddLogo = e.target.id === 'logo'
        this.isAddPic = true
      },
      closePicBox() {
        this.isAddPic = false
        this.currentTab = 'baseInfo'
      },
      addPhotos(res) {
        if (this.isAddLogo) {
          this.projectInfo.avatar = res
        } else {
          this.projectInfo.building_avatar = res
        }
        this.closePicBox()
      },
      /*
     * 根据屏幕宽度screenWidth修改span的值
     * */
      initSpan(screenWidth) {
        if (screenWidth > 1560) {
          this.span = 4
        } else if (screenWidth < 1560 && screenWidth > 1280) {
          this.span = 6
        } else {
          this.span = 8
        }
      },
      /*
      * 返回上一级
      * */
      goBack() {
        this.$router.go(-1)
      },
      /*
      * 打开标注框
      * */
      showMarkWrap() {
        this.isMarker = true
      },
      /*
      * 关闭标注框
      * */
      closeMarkerWrap() {
        this.isMarker = false
      },
      /*
      * 通过id获取指定项目的数据
      * */
      getProjectInfoById(id) {
        this.$post('/project/lists').then(res => {
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('获取项目列表失败！')
          // console.log(res.data.project)
          var result = res.data.project
          var projectInfo = result.find(item => {
            return item.id === id
          })
          projectInfo.type = projectInfo.type.split(' ')
          this.projectInfo = projectInfo
          this.initArea(projectInfo)
          // this.area = [projectInfo.province, projectInfo.city]
        })
          .catch(err => {
            this.$Message.error('获取项目列表失败！')
          })
      },
      /*
      *  提交新建/编辑项目的基本信息
      * */
      btnSubmit(name) {
        var selectArea = this.areaFormat()
        this.$refs[name].validate((valid) => {
          if (!valid) return this.$Message.error('请完善信息~')
          if (this.area.length === 0) return this.$Message.error('项目地址不能为空~')
          if (this.projectInfo.type.length === 0) return this.$Message.error('类型不能为空~')
          var projectInfo = this.projectInfo
          projectInfo.province = selectArea[0]
          projectInfo.city = selectArea[1]
          projectInfo.district = selectArea[2]

          if (this.isAddProject) { // 表示添加
            this.$post('/project/addProject', projectInfo).then(res => {
              if (res.data === '没有权限') {
                this.$Modal.error({
                  title: '警告',
                  content: '没有权限'
                })
                return false
              }
              if (res.status_code !== 200) return this.$Message.error('新建项目失败！')
              this.$Message.success('新建项目成功！')

              setTimeout(() => {
                this.$router.go(-1)
              }, 500)

            }).catch(err => {
              this.$Message.error('新建项目失败！')
            })
          } else { //表示编辑
            this.$post('/project/updateProject', projectInfo).then(res => {
              if (res.data === '没有权限') {
                this.$Modal.error({
                  title: '警告',
                  content: '没有权限'
                })
                return false
              }
              if (res.status_code !== 200) return this.$Message.error('编辑项目失败！')
              this.$Message.success('编辑项目成功！')
            }).catch(err => {
              this.$Message.error('编辑项目失败！')
            })
          }

        })
      },
      /*
      *  添加图集
      * */
      addPicGroup() {
        this.$post('/project/addProjectPhotoType', {id: parseInt(this.$route.params.id)}).then(res => {
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('添加图片集失败！')
          this.picGroup.push(res.data)
        })
          .catch(err => {
            this.$Message.error('添加图片集失败！')
          })
      },
      /*
      *  删除图集
      * */
      deleteGroup(id) {
        this.$post('/project/deleteProjectPhotoType', {id: id}).then(res => {
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('删除图片集失败！')
          this.$Message.success('删除图片集成功！')
          var list = this.picGroup
          list.forEach((item, index) => {
            if (item.id === id) {
              list.splice(index, 1)
            }
          })
          this.picGroup = list
        })
          .catch(err => {
            this.$Message.error('删除图片集失败！')
          })
      },
      /*
      *  展示图集内的图片列表
      * */
      showGroupInnerPicList(id, data) {
        this.isAddGroupPic = true
        this.currentPicsInfo = data
        this.$post('/project/projectPhotoLists', {id: id}).then(res => {
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('获取图片集内容失败！')
          this.currentPics = res.data.photo
        }).catch(err => {
          this.$Message.error('获取图片集内容失败！')
        })
      },
      /*
      * 关闭图集内的图片列表
      * */
      hideGroupInnerPicList() {
        this.isAddGroupPic = !this.isAddGroupPic
        this.currentPicsInfo = {}
        this.getAllPicGroup(parseInt(this.$route.params.id))
      },
      /*
       *  编辑图集
       * */
      eidtGroup(id) {
        if (!this.recordGroupName) return this.$Message.error('图片集名称不能为空！')
        this.$post('/project/updateProjectPhotoType', {
          id: id,
          name: this.recordGroupName
        }).then(res => {
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('编辑图集名称失败！')
          if (res.data === '修改的图集名称已存在') return this.$Message.error('修改的图集名称已存在！')
          this.$Message.success('编辑图集名称成功！')
          this.editGroupId = null
        })
          .catch(err => {
            this.$Message.error('编辑图集名称失败！')
          })
      },
      /*
      * 显示编辑图集按钮
      * */
      showEditBtn(id, name) {
        this.editGroupId = id
      },
      /*
     * 记录当前图集的名称
     * */
      recordName(e) {
        this.recordGroupName = e.target._value
      },
      /*
      * 获取到所有的图集
      * */
      getAllPicGroup(id) {
        this.$post('/project/projectPhotoTypeLists', {id: id}).then(res => {
          if (res.status_code !== 200) return this.$Message.error('获取图片集失败！')
          this.picGroup = res.data.type
        })
          .catch(err => {
            this.$Message.error('获取图片集失败！')
          })
      },
      /*
      * 打开多选图集框
      * */
      openGroupPicBox() {
        this.isAddGroupInnerPic = true
      },
      /*
      *  添加指定图集的内部图片列表
      * */
      addGroupInnerPic(res) {
        var list = []
        res.forEach(item => {
          list.push(item.url)
        })
        this.$post('/project/addProjectPhoto', {
          project_photo_type_id: this.currentPicsInfo.id,
          project_id: parseInt(this.$route.params.id),
          img: list
        }).then(res => {
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('添加图片失败！')
          this.$Message.success('添加图片成功！')
          this.currentPics = this.currentPics.concat(res.data)
          this.isAddGroupInnerPic = false
        }).catch(err => {
          this.$Message.error('添加图片失败！')
          this.isAddGroupInnerPic = false
        })
        this.currentTab = 'photos'
      },
      /*
      * 去续爱添加图集内的图片
      * */
      closeGroupPicBox() {
        this.isAddGroupInnerPic = false
        this.currentTab = 'photos'
      },
      /*
      *  删除指定图集的内部图片列表
      * */
      deleteGroupInnerPic(id) {
        this.$post('/project/deleteProjectPhoto', {id: id}).then(res => {
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('删除图片失败！')
          this.$Message.success('删除图片成功！')
          var list = this.currentPics
          list.forEach((item, index) => {
            if (item.id === id) {
              list.splice(index, 1)
            }
          })
          this.currentPics = list
        }).catch(err => {
          this.$Message.error('删除图片失败！')
        })
      },
      /*
      * 轮播图方式浏览图片集内的图片
      * */
      showSwiper(index) {
        this.currentPicIndex = index
        this.isShowSwiper = true
      },
    },
    computed: {
      ...mapGetters([
        "getSpan",
        "getCurrentProjectInfo"
      ])
    },
    mounted() {
      const that = this
      window.onresize = () => {
        return (() => {
          window.screenWidth = document.body.clientWidth
          that.screenWidth = window.screenWidth
        })()
      }
    },
    watch: {
      screenWidth(val) {
        if (!this.timer) {
          this.screenWidth = val
          this.timer = true
          let that = this
          setTimeout(function () {
            that.initSpan(val)
            that.timer = false
          }, 400)
        }
      }
    },
    components: {
      photosBox,
      swiperBox,
    }
  }
</script>

<style lang="less">

  .pic_box {
    /*background-color: #348EED;*/
    width: 90%;
    min-width: 1000px;
    min-height: 650px;
    padding-bottom: 20px;
    position: relative;
    margin: 50px auto;
    border: 1px solid #ccc;

    > i {
      position: absolute;
      right: -20px;
      top: -20px;
    }
  }

  .add_project_container {

    padding: 20px 30px 50px;
    position: relative;

    /*标签*/
    .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-nav-container {
      height: 100px;
    }
    .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
      background-color: #F2F2F2;
      font-size: 18px;
      color: #797979;
      padding: 0 50px;
      border: 0;
      font-weight: 700;
      height: 70px;
      line-height: 70px;
      border-radius: 0;
    }
    .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
      background-color: #8CC8FF;
      color: #ffffff;
    }
    .ivu-tabs-bar {
      margin-bottom: 40px;
    }
    .ivu-col {
      min-width: 180px;
    }

    .logo_icon_warp {
      width: 200px;
      height: 250px;
      border: 1px solid black;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    }
    .logo_icon_tips {
      display: flex;
      align-items: center;
      line-height: 40px;
      color: #c3c3c3;
    }

    .btns {
      display: flex;
      justify-content: center;
      margin-top: 30px;

      .goback {
        margin-left: 30px;
      }
    }

    /*标注楼栋*/
    .mark_wrap {
      position: absolute;
      left: 100px;
      top: 10%;
      width: 80%;
      height: 75%;
      background-color: #ffffff;
      z-index: 999999;
      box-sizing: border-box;
      padding: 30px;
      font-size: 20px;

      .header {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        border-bottom: 1px solid #c3c3c3;
        padding: 10px 0 20px;
        position: relative;

        span {
          font-weight: 700;
          margin-right: 100px;
        }

        .upload_btn {
          padding: 5px 30px;
          background-color: #ffffff;
          border: 1px solid #c3c3c3;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
        }

        .close {
          position: absolute;
          right: 30px;
          color: #c3c3c3;
          cursor: pointer;
        }
      }

      .body {
        font-size: 20px;
        width: 100%;
        height: 85%;
        color: #c3c3c3;
        position: relative;

        span {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }

    }

    .mengban {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, .6);
      z-index: 999;
    }

    /*相册部分*/
    .photos_wrap {

      .header {
        height: 80px;

        .add_pics_btn {
          background-color: #169BD5;
          padding: 12px 35px;
          cursor: pointer;
          color: #ffffff;
          border-radius: 5px;
          font-size: 12px;

        }
      }

      .body {

        .pic_item {
          height: 400px;

          .pic_info {
            box-sizing: border-box;

            img {
              width: 100%;
              height: auto;
              max-height: 250px;
            }

            .name {
              margin: 15px 0;
            }

            .btn_wrap {
              display: flex;
              justify-content: space-between;
              align-items: center;

              .edit_btn {
                flex: 5;
                width: 30px;
              }
              .check_btn {
                flex: 1;
                cursor: pointer;
                color: #348EED;
              }
              .del_btn {
                flex: 1;
                /*margin: 0 10px;*/
                cursor: pointer;
                color: red;
              }
            }
          }

        }

        .pic_group_tips {
          font-size: 20px;
          color: #cccccc;
          text-align: center;
        }

      }

    }

    /*新增图库*/
    .add_pic_wrap {
      padding: 0 30px;
      position: relative;

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
        font-weight: 700;
      }

      .body {
        width: 100%;
        min-height: 650px;
        overflow: hidden;
        margin: 15px 0;
        background-color: white;
        box-sizing: border-box;
        padding: 20px;

        .pic_item {
          width: 150px;
          /*height: 250px;*/
          margin-right: 15px;
          margin-bottom: 15px;

          .pic_info {

            img {
              width: 150px;
              height: 160px;
              cursor: pointer;
            }

          }

          .add_group_inner_pic {
            border: 2px dashed #348EED;
            color: #348EED;
            font-size: 100px;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 200px;
            cursor: pointer;
          }
        }

      }

      .btn_wrap {
        display: flex;
        justify-content: center;

        .cancel {
          margin-left: 30px;
        }
      }

    }

    /*轮播图列表*/
    .swiper_box {
      width: 100%;

      .header {
        display: flex;
        justify-content: space-between;
        font-size: 20px;
        padding: 0 20px;
      }
    }
  }

  .go_back {
    padding: 10px 35px;
    color: #666;
  }
</style>
