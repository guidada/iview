<template>
  <div v-if="isAddPic" class="pic_box">
    <photosBox
      style="padding: 0 20px"
      :toSelect="true"
      :count="50"
      @canclePhotos="closePicBox"
      @addPhotos="addPhotos"
    ></photosBox>
  </div>
  <div v-else-if="isShowSwiper">
    <Button @click="isShowSwiper=false">返回</Button>
    <swiper :swiperList="currentPics"></swiper>
  </div>
  <div v-else class="view_return_money_container">
    <h2>{{isShenPi?'审批':'查看'}}退认购单</h2>
    <Form ref="form" :label-width="135">
      <!-- 状态-->
      <Row>
        <Col span="10">
          <FormItem label="管理项目：">
            <div>{{viewInfo.project.name}}</div>
          </FormItem>
        </Col>
        <Col span="10" offset="1">
          <FormItem label="审批状态：">
            <div>{{viewInfo.state}}</div>
          </FormItem>
        </Col>
      </Row>
      <!-- 关联房源-->
      <Row>
        <Col span="5" style="min-width: 225px">
          <FormItem label="关联房源：" prop="house_id">
            <div>{{viewInfo.house.house_num}}</div>
          </FormItem>
        </Col>
      </Row>
      <!-- 关联房源的信息-->
      <Row>
        <Col>
          <FormItem>
            <div class="house_info">
              <Row>
                <h4 style="font-size: 14px">
                  相关信息
                </h4>
              </Row>
              <div>
                <Row style="padding: 0 30px">
                  <Col :span="8">
                    房源状态：<span style="color: #348EED">{{viewInfo.house.state}}</span>
                  </Col>
                </Row>
                <Row>
                  <h4 style="font-size: 14px">
                    客户信息
                  </h4>
                </Row>
                <Row style="padding: 0 15px">
                  <Col :span="4" style="min-width: 130px">
                    客户姓名：{{clientInfo.name}}
                  </Col>
                  <Col :span="6" style="min-width: 180px">
                    联系方式：{{clientInfo.phone}}
                  </Col>
                  <Col :span="4" style="min-width: 130px">
                    认购金：{{clientInfo.price}}元
                  </Col>
                  <Col :span="5">
                    认购时间：{{clientInfo.time}}
                  </Col>
                </Row>
              </div>
            </div>
          </FormItem>
        </Col>
      </Row>
      <!-- 备注-->
      <Row>
        <Col span="10">
          <FormItem label="备注：">
            <div>
              <Input type="textarea" v-model="viewInfo.infos" :disabled="!isEditReturnMoney"></Input>
            </div>
          </FormItem>
        </Col>
      </Row>
      <!-- 文件上传-->
      <Row>
        <Col span="12">
          <FormItem label="文件上传：">
            <div>
              <Button
                type="primary"
                @click="gotoUploadPic"
                :disabled="!isEditReturnMoney"
              >上传
              </Button>
              <span
                v-if="imgList.length"
                style="margin-left: 30px;color: #348EED;cursor: pointer;"
                @click="gotoShowImg"
              >上传了{{imgList.length}}份文件</span>
              <span
                v-else
                style="margin-left: 30px;color: #aaaaaa;">请上传pdf文件或者jpg图片</span>
            </div>
          </FormItem>
        </Col>
      </Row>
      <!--审批处理-->
      <div class="approve_wrap" v-if="isShenPi">
        <h3>审批处理</h3>
        <Row>
          <Col span="16">
            <FormItem label="备注：">
              <div>
                <Input type="textarea" v-model="reject"></Input>
              </div>
            </FormItem>
          </Col>
        </Row>
        <div class="btn_wrap">
          <Button type="primary" @click="HandleAgree">通过</Button>
          <Button type="warning" style="margin-left: 30px" @click="HandleReject">驳回</Button>
          <Button type="default" style="margin-left: 30px" @click="goback">返回</Button>
        </div>
      </div>
      <!-- 提交按钮-->
      <div v-else class="btn_wrap">
        <Button
          type="primary"
          @click="editReturnMoneyForm('修改')"
          :disabled="!isEditReturnMoney"
        >确认修改</Button>
        <Button
          type="warning"
          @click="editReturnMoneyForm('取消')"
          :disabled="!isEditReturnMoney"
          style="margin-left: 30px"
        >取消申请</Button>
        <Button type="default" style="margin-left: 30px" @click="goback">返回</Button>
      </div>
    </Form>
    <!--审批流程-->
    <div class="approve_process_wrap">
      <h3>审批流程</h3>
      <Table border :columns="columns" :data="approveList"></Table>
    </div>
  </div>
</template>

<script>
  import photosBox from '@/components/common/upLoadPhotosList/photosBox'
  import swiper from '@/components/common/swiper/swiper'

  export default {
    name: "editForm",
    components: {
      photosBox,
      swiper,
    },
    data() {
      return {
        // 是否去上传图片
        isAddPic: false,
        // 是否展示轮播图
        isShowSwiper:false,
        // 审批流程列表
        approveList: [],
        columns: [
          {
            title: '操作时间',
            key: 'created_at'
          },
          {
            title: '本级操作者',
            key: 'operation_up'
          },
          {
            title: '操作结果',
            key: 'infos'
          },
          {
            title: '操作说明',
            key: 'desc'
          },
          {
            title: '下级操作者',
            key: 'operation_down'
          }
        ],
        // 驳回描述（通过可以选填，驳回必填）
        reject: '',
        // 退认购金客户基本信息
        clientInfo: {},
        // 上传的图片列表
        imgList: [],
        // 格式化之后的上传的图片列表（用于轮播图查看）
        currentPics:[]
      }
    },
    props: ['viewInfo', 'isShenPi', 'isEditReturnMoney'],
    created() {
      this.approveList = this.viewInfo.unsubscribe_follow
      this.clientInfo = {
        name: this.viewInfo.customer.name,
        phone: this.viewInfo.customer.phone,
        price: this.viewInfo.subscribe.price,
        time: this.formatTime(new Date(this.viewInfo.subscribe.subscribe_time))
      }
      this.imgList = this.viewInfo.img
    },
    methods: {
      goback() {
        this.$emit('cancelView')
      },
      /*
      * 通过审批
      * */
      HandleAgree() {
        var info = {
          project_id: parseInt(this.$route.params.id),
          id: this.viewInfo.id,
          type: '通过',
          reject: this.reject
        }
        this.submitForm(info)
      },
      /*
      * 拒绝审批
      * */
      HandleReject() {
        if (!this.reject) return this.$Message.error('请输入驳回理由！')
        var info = {
          project_id: parseInt(this.$route.params.id),
          id: this.viewInfo.id,
          type: '驳回',
          reject: this.reject
        }
        this.submitForm(info)
      },
      /*
      * 审批处理
      * */
      submitForm(data) {
        this.$post('/unsubscribe/followUnsubscribe', data).then(res => {
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('提交审批失败！')
          if (res.data === '请去添加价格权限或添加的职务和房源价格权限中的职务相同') return this.$Message.error('请去添加价格权限或添加的职务和房源价格权限中的职务相同！')
          this.$Message.success('提交审批成功！')
          this.$emit('submitSuccess')
        }).catch(err => {
          this.$Message.error('提交审批失败！')
          console.log(err)
        })
      },
      /*
      *  修改退认购金单驳回申请表单
      * */
      editReturnMoneyForm(type) {
        if (!this.imgList.length) return this.$Message.error('请上传退认购金文件！')
        var returnMoneyFormInfo = {
          project_id: parseInt(this.$route.params.id),
          unsubscribe_id: this.viewInfo.id,
          type: type,
          img: this.imgList,
          infos: this.viewInfo.infos,
        }
          this.$post('/unsubscribe/updateUnsubscribe', returnMoneyFormInfo).then(res => {
            if (res.data === '没有权限') {
              this.$Modal.error({
                title: '警告',
                content: '没有权限'
              })
              return false
            }
            if (res.status_code !== 200) return this.$Message.error('修改退认购单失败！')
            this.$Message.success('修改退认购单成功！')
            this.$emit('editSuccess')
          }).catch(err => {
            this.$Message.error('修改退认购单失败！')
            console.log(err)
          })
      },
      /*
      * 时间格式化
      * */
      formatTime(t) {
        return t.getFullYear() + '-' + this.formatNum(t.getMonth() + 1) + '-' + this.formatNum(t.getDate())
      },
      /*
      * 个位数字自动加 ‘0’
      * */
      formatNum(d) {
        return d >= 10 ? d : '0' + d
      },
      /*
     *  去上传图片
     * */
      gotoUploadPic() {
        this.isAddPic = true
      },
      /*
      * 取消添加图片
      * */
      closePicBox() {
        this.isAddPic = false
      },
      /*
     * 添加图片成功的处理
     * */
      addPhotos(res) {
        var list = []
        res.forEach(item => {
          list.push(item.url)
        })
        this.imgList = list
        this.closePicBox()
      },
      /*
      *  查看上传的文件，以轮播图的方式
      * */
      gotoShowImg() {
        var currentPics = []
        this.imgList.forEach(item=>{
          currentPics.push({
            avatar:item
          })
        })
        this.currentPics = currentPics
        this.isShowSwiper = true
      },
    }
  }
</script>

<style lang="less" scoped>

  .view_return_money_container {
    padding: 20px 30px 50px;

    h2 {
      line-height: 30px;
      margin-bottom: 20px;
    }

    .house_info {
      padding: 20px;
      background-color: #f0f2f5;
    }

    .btn_wrap {
      display: flex;
      justify-content: center;
      margin: 30px 0;
    }

    .approve_process_wrap,
    .approve_wrap {
      h3 {
        font-size: 18px;
        line-height: 60px;
        border-bottom: 1px solid #aaaaaa;
        margin-bottom: 20px;
      }
    }
  }

</style>
