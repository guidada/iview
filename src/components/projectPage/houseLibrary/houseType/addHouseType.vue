<template>
  <div v-if="isAddPic" class="pic_box">
    <photosBox
      style="padding: 0 20px"
      :toSelect="true"
      :count="6"
      @canclePhotos="closePicBox"
      @addPhotos="addHouseTypePic"
    ></photosBox>
  </div>
  <!--轮播图-->
  <div class="swiper_box" v-else-if="isShowSwiper">
    <div class="header">
      <Breadcrumb style="font-size: 18px">
        <BreadcrumbItem style="color: #348EED">{{houseTypeInfo.name}}</BreadcrumbItem>
        <BreadcrumbItem>户型图</BreadcrumbItem>
      </Breadcrumb>
      <Button class="go_back" @click="isShowSwiper=false">返回</Button>
    </div>
    <swiperBox :swiperList="currentPics"></swiperBox>
  </div>
  <!--主体编辑区-->
  <div v-else class="add_house_type_container">
    <Form class="form" ref="houseTypeForm" :model="houseTypeInfo" :rules="houseTypeRules" :label-width="100">
      <!-- 户型名称 -->
      <Row>
        <Col span="11">
          <FormItem label="户型名称：" prop="name">
            <Input v-model="houseTypeInfo.name" placeholder="请输入户型的名称" :disabled="isReadOnly"></Input>
          </FormItem>
        </Col>
      </Row>
      <!-- 户型选择 -->
      <Row>
        <Col span="6" style="max-width: 300px">
          <FormItem label="户型选择：" prop="jushi">
            <Select v-model="houseTypeInfo.jushi" placeholder="请选择居室数" :disabled="isReadOnly">
              <Option v-for="(item, index) in jushi" :value="item" :key="index">{{item}}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="2">
          <FormItem :label-width="1" prop="hall">
            <Select v-model="houseTypeInfo.hall" placeholder="请选择厅数" :disabled="isReadOnly">
              <Option v-for="(item, index) in hall" :value="item" :key="index">{{item}}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="2">
          <FormItem :label-width="1" prop="bathroom">
            <Select v-model="houseTypeInfo.bathroom" placeholder="请选择卫生间数" :disabled="isReadOnly">
              <Option v-for="(item, index) in bathroom" :value="item" :key="index">{{item}}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <!-- 户型面积 -->
      <Row>
        <Col span="11">
          <FormItem label="户型面积：" prop="mianji">
            <InputNumber
              style="width: 100%"
              :min="1"
              v-model="houseTypeInfo.mianji"
              :disabled="isReadOnly"
              placeholder="请输入户型的面积"></InputNumber>
          </FormItem>
        </Col>
        <Col span="1" style="margin-left: 10px;line-height: 30px;font-size: 16px">㎡</Col>
      </Row>
      <!-- 户型介绍 -->
      <Row>
        <Col span="11">
          <FormItem label="户型介绍：">
            <Input v-model="houseTypeInfo.desc" placeholder="请输入户型介绍" type="textarea" :disabled="isReadOnly"></Input>
          </FormItem>
        </Col>
      </Row>

      <!--上传户型图-->
      <Row>
        <Col span="5">
          <FormItem label="户型图：">
            <Button
              style="padding: 5px 30px;background-color: #348EED; color: white"
              @click="openPicBox"
              id="logo"
              v-if="!isReadOnly"
            >上传
            </Button>
          </FormItem>
        </Col>
        <Col span="6">
          <div class="tips" v-if="!isReadOnly">
            可上传多张户型图
          </div>
        </Col>
      </Row>
      <Row v-if="!isReadOnly">
        <Col>
          <div class="upload_box img_box">
            <h3>当前要上传的图片：</h3>
            <div
              v-if="uploadeImg.length"
              class="img_list"
            >
              <div
                v-for="(item,index) in uploadeImg"
                :key="index"
                class="img_item_wrap"
              >
                <img :src="item">
                <Icon type="md-close" size="25" @click="deleteUploadPic(index)"/>
              </div>
            </div>
            <div v-else class="tips">暂未选择图片</div>
          </div>
        </Col>
      </Row>
      <Row v-if="houseTypeInfo.id">
        <Col>
          <div class="icon_warp img_box">
            <h3>已上传的户型图片列表：</h3>
            <div
              v-if="houseTypeInfo.huxing_photo.length"
              class="img_list"
            >
              <div
                v-for="(item,index) in houseTypeInfo.huxing_photo"
                :key="index"
                class="img_item_wrap"
              >
                <img :src="item.imgurl" @click="showSwiper">
                <Icon type="md-close" size="25" @click="deleteHuXingPic(item)" v-if="!isReadOnly"/>
              </div>
            </div>
            <div v-else class="tips">暂无户型图</div>
          </div>
        </Col>
      </Row>

      <!-- 按钮 -->
      <div class="btns">
        <Button v-if="!isReadOnly" type="success" @click="btnSubmit('houseTypeForm')">保存</Button>
        <Button @click="goBack" class="goback">返回</Button>
      </div>
    </Form>
  </div>
</template>

<script>
  import photosBox from '@/components/common/upLoadPhotosList/photosBox'
  import swiperBox from '@/components/common/swiper/swiper'

  export default {
    name: "addHouseType",
    components: {
      photosBox,
      swiperBox,
    },
    data() {
      return {
        isAddPic: false,
        // 户型表单
        houseTypeInfo: {
          name: '',
          desc: '',
          mianji: null,
          jushi: '一室',
          hall: '一厅',
          bathroom: '一卫',
          img: [],
          huxing_photo: []
        },
        // 户型表单验证规则
        houseTypeRules: {
          name: [{
            required: true,
            message: '户型名称不能为空',
            trigger: 'blur'
          }],
          jushi: [
            {
              required: true,
              type: 'array',
              validator(rule, value, callback) {
                var errors = []
                callback(errors)
              }
            }],
          hall: [
            {
              required: true,
              type: 'array',
              validator(rule, value, callback) {
                var errors = []
                callback(errors)
              }
            }],
          bathroom: [
            {
              required: true,
              type: 'array',
              validator(rule, value, callback) {
                var errors = []
                callback(errors)
              }
            }],
          mianji: [
            {
              required: true,
              type: 'number',
              message: '户型面积不能为空',
              trigger: 'blur'
            }],
        },
        // 所有的居室类型
        jushi: [],
        // 所有的客厅数量
        hall: ['无', '一厅', '两厅', '三厅', '四厅', '五厅', '五厅以上'],
        bathroom: ['无', '一卫', '两卫', '三卫', '四卫', '五卫', '五卫以上'],
        // 需要上传的图片列表
        uploadeImg: [],
        // 是否展示轮播图
        isShowSwiper:false
      }
    },
    props: ['editHouseType', 'isReadOnly'],
    created() {
      this.getAllJuShi()
      if (this.editHouseType.id) {
        var houseTypeInfo = this.editHouseType
        houseTypeInfo.mianji = parseInt(this.editHouseType.mianji)
        this.houseTypeInfo = houseTypeInfo
      }
    },
    methods: {
      /*
      * 返回到户型列表页
      * */
      goBack() {
        this.$emit('cancelHandle')
      },
      /*
      * 打开图片选择盒子
      * */
      openPicBox() {
        this.isAddPic = true
      },
      /*
      * 关闭图片盒子
      * */
      closePicBox() {
        this.isAddPic = false
      },
      /*
      * 添加选中的图片到列表
      * */
      addHouseTypePic(res) {
        var list = []
        res.forEach(item => {
          list.push(item.url)
        })
        this.uploadeImg = this.uploadeImg.concat(list)
        this.houseTypeInfo.img = this.uploadeImg
        this.isAddPic = false
      },
      /*
      *  删除已上传的户型图片
      * */
      deleteHuXingPic(data) {
        this.$post('/project/deleteHuxingPhoto',{id:data.id}).then(res=>{
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('删除户型图片失败！')
          this.$Message.success('删除户型图片成功！')
          var list = this.houseTypeInfo.huxing_photo
          list.forEach((item,index)=>{
            if (item.id === data.id) {
              list.splice(index,1)
            }
          })
          this.houseTypeInfo.huxing_photo = list
        }).catch(err=>{
          this.$Message.error('删除户型图片失败！')
        })
      },
      /*
     *  删除准备上传的户型图片
     * */
      deleteUploadPic(i) {
        var uploadeImg =  this.uploadeImg
        uploadeImg.forEach((item,index)=>{
          if (index === i) {
            uploadeImg.splice(index,1)
          }
        })
        this.uploadeImg = uploadeImg
        this.houseTypeInfo.img = this.uploadeImg
      },
      /*
     * 获取到所有的居室类型
     * */
      getAllJuShi() {
        this.$post('/project/jushi').then(res => {
          if (res.status_code !== 200) return this.$Message.error('获取居室列表失败！')
          this.jushi = this.jushi.concat(res.data.jushi)
        }).catch(error => {
          this.$Message.error('获取居室列表失败！')
        })
      },
      /*
      * 提交表单信息
      * */
      btnSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (!valid) return this.$Message.error('请完善信息~')
          if (!this.houseTypeInfo.jushi) return this.$Message.error('居室不能为空~')
          if (!this.houseTypeInfo.hall) return this.$Message.error('厅数不能为空~')
          if (!this.houseTypeInfo.bathroom) return this.$Message.error('卫生间不能为空~')
          var houseTypeInfo = this.houseTypeInfo
          if (houseTypeInfo.id) { //编辑的情况
            houseTypeInfo.peoject_id = parseInt(this.$route.params.id)
            this.$post('/project/updateProjectHuxing', houseTypeInfo).then(res => {
              if (res.data === '没有权限') {
                this.$Modal.error({
                  title: '警告',
                  content: '没有权限'
                })
                return false
              }
              if (res.status_code !== 200) return this.$Message.error('新增户型失败！')
              if (res.data === '添加的户型名称已存在') return this.$Message.error('添加的户型名称已存在！')
              this.$emit('editOldHouseType', res.data)
            }).catch(err => {
              this.$Message.error('新增户型失败！')
            })
          } else { //添加的情况
            houseTypeInfo.id = parseInt(this.$route.params.id)
            this.$post('/project/addProjectHuxing', houseTypeInfo).then(res => {
              if (res.data === '没有权限') {
                this.$Modal.error({
                  title: '警告',
                  content: '没有权限'
                })
                return false
              }
              if (res.status_code !== 200) return this.$Message.error('新增户型失败！')
              if (res.data === '添加的户型名称已存在') return this.$Message.error('添加的户型名称已存在！')
              this.$emit('addNewHouseType', res.data)
            }).catch(err => {
              this.$Message.error('新增户型失败！')
            })
          }
        })
      },
      /*
      * 展示轮播图
      * */
      showSwiper() {
        var currentPics = []
        this.houseTypeInfo.huxing_photo.forEach(item=>{
          currentPics.push({
            avatar:item.imgurl
          })
        })
        this.currentPics = currentPics
        this.isShowSwiper = true
      },
    }
  }
</script>

<style lang="less" scoped>

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

  .add_house_type_container {
    padding: 20px 30px 50px;
    position: relative;

    .ivu-col {
      min-width: 180px;
    }

    .img_box {
      width: 100%;

      .img_list {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        overflow: hidden;

        .img_item_wrap {
          position: relative;

          i {
            position: absolute;
            right: 10px;
            top: 10px;
            cursor: pointer;

            &:hover {
              color: red;
            }

          }
        }

        img {
          width: 100px;
          height: 100px;
          margin: 10px;
          border: 1px solid #999;
        }
      }

      .tips {
        display: flex;
        justify-content: center;
        align-items: center;
        line-height: 100px;
        font-size: 16px;
        color: #c3c3c3;
      }
    }

    .upload_box {
      min-height: 100px;
    }

    .icon_warp {
      min-height: 250px;
    }
    .tips {
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
