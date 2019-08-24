<template>
  <!--添加/编辑/查看户型-->
  <addHouseType
    v-if="isAddHouseType"
    :editHouseType="currentHouseType"
    :isReadOnly="isReadOnly"
    @cancelHandle="closeAddHouseTypeBox"
    @addNewHouseType="addNewHouseType"
    @editOldHouseType="editOldHouseType"
  ></addHouseType>
  <!--轮播图-->
  <div class="swiper_box" v-else-if="isShowSwiper">
    <div class="header">
      <Breadcrumb style="font-size: 18px">
        <BreadcrumbItem style="color: #348EED">{{currentHouseType.name}}</BreadcrumbItem>
        <BreadcrumbItem>户型图</BreadcrumbItem>
      </Breadcrumb>
      <Button class="go_back" @click="isShowSwiper=false">返回</Button>
      <!--<Icon type="ios-close-circle-outline" size="40" @click="isShowSwiper=false"/>-->
    </div>
    <swiperBox :swiperList="currentPics"></swiperBox>
  </div>
  <!--户型列表-->
  <div v-else class="type_management_container">
    <!--新增户型按钮-->
    <div class="header">
      <Button class="add_type" @click="gotoAddHouseType">新增户型</Button>
      <!--<Button class="go_back">返回</Button>-->
    </div>
    <!--户型列表-->
    <Row :gutter="32" class="type_list">
      <Col :span="span" class="type_item" v-for="item in houseTypeList" :key="item.id">
        <Card class="type_info">

          <img :src="item.avatar || 'https://images.fangbee.cn/1/photos/46b7f9b2176b0d9cd8bbba7664441c75filepng'" @click="showSwiper(item.id)">

          <p class="type_detail">
            <span class="type_name">{{item.name}}</span>
            <span class="type_jushi">{{item.jushi}}</span>
          </p>
          <p class="more_operate">
            <span @click="GoToShowHouseType(item.id)">查看</span>
            <span @click="goToEditHouseType(item.id)">编辑</span>
            <span @click="deleteHouseType(item.id)">删除</span>
          </p>
        </Card>
      </Col>
    </Row>
    <div v-if="!houseTypeList.length" class="no_house_type">
      暂无户型
    </div>
    <!--分页-->
    <div v-if="total>pageSize" style="display: flex;justify-content: center">
      <Page :total="total" :page-size="pageSize" @on-change="changePage"></Page>
    </div>
  </div>
</template>

<script>
  import addHouseType from './addHouseType'
  import swiperBox from '@/components/common/swiper/swiper'

  export default {
    name: "houseType",
    components: {
      addHouseType,
      swiperBox,
    },
    data() {
      return {
        // Col的span
        span: 4,
        // 当前body宽度
        screenWidth: document.body.clientWidth,
        isAddHouseType: false,
        // 户型表单是否只读
        isReadOnly:false,
        // 户型列表
        houseTypeList: [],
        // 当前选中的户型
        currentHouseType: {},
        // 当前选中的户型的户型图列表
        currentPics:[],
        // 总户型数
        total: 0,
        // 每页条数
        pageSize: 12,
        // 是否展示轮播图
        isShowSwiper:false
      }
    },
    created() {
      this.initSpan(this.screenWidth)
      this.getAllHouseType()
    },
    methods: {
      /*
     * 获取到所有的户型
     * */
      getAllHouseType() {
        this.$post('/project/projectHuxingLists', {id: parseInt(this.$route.params.id)}).then(res => {
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('获取户型列表失败！')
          this.houseTypeList = res.data.huxing[0]
          this.total = res.data.huxing[0].length
        }).catch(error => {
          this.$Message.error('获取户型列表失败！')
        })
      },
      /*
      * 去添加户型
      * */
      gotoAddHouseType() {
        this.currentHouseType={}
        this.isAddHouseType = true
        this.isReadOnly = false
      },
      /*
      * 关闭添加户型
      * */
      closeAddHouseTypeBox() {
        this.isAddHouseType = false
      },
      /*
      * 获取到新添加的户型，并渲染到列表
      * */
      addNewHouseType(res) {
        this.isAddHouseType = false
        this.houseTypeList.push(res)
      },
      /*
      * 编辑后的户型，重新渲染
      * */
      editOldHouseType(res) {
        this.isAddHouseType = false
        var list =  this.houseTypeList
        list.forEach((item,index)=>{
          if (item.id === res.id) {
            list[index] = res
          }
        })
        this.houseTypeList = list
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
      *  分页功能，页面跳转
      * */
      changePage(e) {
        // console.log("当前页面==========", e)
      },
      /*
      *  以轮播图格式展示户型图
      * */
      showSwiper(id) {
        this.currentHouseType = this.houseTypeList.find(item => {
          return item.id === id
        })
        // console.log(this.currentHouseType)
        if (!this.currentHouseType.huxing_photo.length) return this.$Message.error('当前户型没有图片')
        var currentPics = []
        this.currentHouseType.huxing_photo.forEach(item=>{
          currentPics.push({
            avatar:item.imgurl
          })
        })
        this.currentPics = currentPics
        this.isShowSwiper = true
      },
      /*
      * 查看户型详情
      * */
      GoToShowHouseType(id) {
        this.currentHouseType = this.houseTypeList.find(item => {
          return item.id === id
        })
        this.isAddHouseType = true
        this.isReadOnly = true
      },
      /*
      * 去编辑户型
      * */
      goToEditHouseType(id) {
        this.currentHouseType = this.houseTypeList.find(item => {
          return item.id === id
        })
        // console.log('准备去编辑的户型=============',this.currentHouseType)
        this.isAddHouseType = true
        this.isReadOnly = false
      },
      /*
      * 删除户型
      * */
      deleteHouseType(id) {
        this.$post('/project/deleteProjectHuxing', {id: id}).then(res => {
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('删除户型失败！')
          var list = this.houseTypeList
          list.forEach((item, index) => {
            if (item.id === id) {
              list.splice(index, 1)
            }
          })
          this.houseTypeList = list
        }).catch(err => {
          this.$Message.error('删除户型失败！')
        })
      }
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
    }
  }
</script>

<style lang="less" scoped>
  .type_management_container {
    font-size: 12px;
    padding: 30px 30px 80px;

    .header {
      display: flex;
      justify-content: space-between;
      padding: 0 20px 20px;
      border-bottom: 1px solid #cccccc;

      .add_type {
        background-color: #169BD5;
        color: #ffffff;
        font-size: 16px;
        padding: 10px 30px;
        border-radius: 5px;
      }
    }

    .go_back {
      padding: 10px 35px;
      color: #666;
    }

    /*项目列表*/
    .type_list {
      padding: 30px 0;
      .type_item {
        width: 260px;
        height: 400px;

        .ivu-card {
          font-size: 12px !important;
        }

        .type_info {
          box-sizing: border-box;
          box-shadow: 1px 0 2px 1px rgba(0, 0, 0, .3);

          &:hover {
            box-shadow: 2px 1px 3px 2px rgba(0, 0, 0, .4);
            transform: scale(1.05);
          }
          img {
            width: 100%;
            height: 200px;
            /*height: auto;*/
          }

          .type_detail {
            display: flex;
            justify-content: space-between;
            line-height: 40px;
            border-bottom: 1px solid #c3c3c3;

            .type_name {
              flex: 2;
              font-size: 16px;
              font-weight: 700;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            .type_jushi {
              flex: 1;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              text-align: right;
            }

          }

          .more_operate {
            display: flex;
            justify-content: flex-start;
            line-height: 20px;
            margin-top: 10px;

            span {
              color: #348EED;
              cursor: pointer;
              margin-right: 15px;
            }
          }

        }

      }

    }

    .no_house_type {
      width: 100%;
      font-size: 20px;
      color: #aaa;
      text-align: center;
      margin-top: 100px;
    }
  }

  /*轮播图列表*/
  .swiper_box {
    width: 100%;

    .header {
      display: flex;
      justify-content: space-between;
      font-size: 20px;
      padding: 20px;
      background-color: #ffffff;
    }
  }
</style>
