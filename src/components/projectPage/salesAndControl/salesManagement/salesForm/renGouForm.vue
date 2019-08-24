<template>
  <!--照片盒子，添加协议时使用，一次只能添加一张图片-->
  <div v-if="isUploadRenGou" class="pic_box">
    <photosBox
      style="padding: 0 20px"
      :toSelect="true"
      :count="50"
      @canclePhotos="closePicBox"
      @addPhotos="addRengouPhotos"
    ></photosBox>
  </div>
  <!-- 认购协议轮播图-->
  <div v-else-if="isShowRenGouSwiper">
    <Button @click="cancelShowRenGouSwiper">返回</Button>
    <swiper
      :swiperList="renGouImgList"
      :currentPicIndex="0"
    ></swiper>
  </div>
  <!-- 认购表单主体-->
  <Form v-else class="ren_gou_form" ref="renGouForm" :model="renGouInfo" :rules="renGouRules" :label-width="135">
    <!--客户信息-->
    <Row>
      <Col span="11">
        <FormItem label="客户信息：">
          <div style="display: flex;">
            <Select filterable
                    placeholder="请输入客户姓名/手机号"
                    @on-change="getRenGouClientInfo"
                    :disabled="currentStateNum>2 || globalReadOnly"
            >
              <Option v-for="item in allClientList" :value="item.id" :key="item.id">{{ item.name + '/' +
                item.phone}}
              </Option>
            </Select>
          </div>
        </FormItem>
      </Col>
      <Icon
        type="ios-add-circle-outline"
        class="add_client_btn"
        @click="addRenGouClient"
      />
    </Row>
    <div
      v-if="renGouClientList.length"
      :disabled="currentStateNum>2 || globalReadOnly"
      style="display: flex;justify-content: space-between;padding: 0 50px 20px;align-items: center;"
    >
      <div style="color: #aaaaaa">温馨提示：添加买受人后请点击右侧
        <span style="color: #348EED">提交按钮</span>
        确认，否则买受人信息将 <span style="color: red;">丢失</span> ！
      </div>
      <Button
        type="info"
        @click="submitRenGouList"
      >提交认购客户列表
      </Button>
    </div>
    <!--客户列表-->
    <div class="client_list_wrap">
      <table class="table_wrap" cellspacing="0">
        <thead>
        <tr>
          <th>客户姓名</th>
          <th>联系方式</th>
          <th>是否主买受人</th>
          <th>删除</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="renGouClientList.length" v-for="item in renGouClientList" :key="item.id">
          <td>{{item.name}}</td>
          <td>{{item.phone}}</td>
          <td>
            <Switch v-model="item.is_check" :disabled="currentStateNum>2 || globalReadOnly">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </Switch>
          </td>
          <td>
            <Icon
              class="delete_btn"
              type="ios-close-circle-outline"
              @click="deleteRenGouClient(item.id)"
            />
          </td>
        </tr>
        <tr v-if="!renGouClientList.length">
          <td colspan="4">
            暂无认购
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <hr style="border: 1px dashed #666666;margin: 30px 0">
    <!--需补缴认购金-->
    <Row>
      <Col span="11">
        <FormItem label="需补缴认购金：">
          <div style="display: flex">
            <InputNumber
              style="width: 100%;"
              :min="1"
              :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => `${value}`.replace(/￥\s?|(,*)/g, '')"
              v-model="renGouInfo.subscribe_a_price"
              disabled
            ></InputNumber>
            <span style="margin-left: 10px">元</span>
          </div>
        </FormItem>
      </Col>
      <Col span="11" offset="2" style="line-height: 30px;color: #aaaaaa">
        <span>注：补缴认购金：指定认购金额-认筹金额；此数值为系统计算所得</span>
      </Col>
    </Row>
    <!--实际补缴认购金-->
    <Row>
      <Col span="11">
        <FormItem label="实际补缴认购金：" prop="subscribe_price">
          <div style="display: flex">
            <InputNumber
              style="width: 100%;"
              :min="0"
              :max="renGouInfo.subscribe_a_price || 50000"
              :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => `${value}`.replace(/￥\s?|(,*)/g, '')"
              v-model="renGouInfo.subscribe_price"
              placeholder="请输入实际补缴认购金"
              :disabled="currentStateNum>1 || readOnly || globalReadOnly"
            ></InputNumber>
            <span style="margin-left: 10px">元</span>
          </div>
        </FormItem>
      </Col>
    </Row>
    <!--认购时间-->
    <Row>
      <Col span="11">
        <FormItem label="认购时间：" prop="subscribe_time">
          <DatePicker
            style="width: 100%"
            type="date"
            v-model="renGouInfo.subscribe_time"
            :disabled="currentStateNum>1 || readOnly || globalReadOnly"
            placeholder="请输入认购时间"></DatePicker>
        </FormItem>
      </Col>
    </Row>
    <!--上传-->
    <Row>
      <Col span="11">
        <FormItem label="上传：" prop="subscribe_img">
          <div style="display: flex">
            <Button
              icon="ios-cloud-upload-outline"
              @click="gotoUploadRenGou"
              :disabled="currentStateNum>1 || readOnly || globalReadOnly"
            >上传文件
            </Button>
            <Button
              v-if="renGouInfo.subscribe_img.length"
              @click="showRenGouSwiper"
              style="margin-left: 30px;color: #348EED;border: 0;"
            >查看文件
            </Button>
          </div>
        </FormItem>
      </Col>
    </Row>
    <!--提交认购表单-->
    <div class="btn_wrap" v-if="currentStateNum===1 && !globalReadOnly">
      <Button
        type="primary"
        @click="submitModal=true"
        v-if="!readOnly"
      >确定
      </Button>
      <Modal
        v-model="submitModal"
        title="请确认是否要提交该表单"
        @on-ok="submitRenGou"
        @on-cancel="cancelSubmit">
        <p style="color: red">注意：确认后部分内容不可更改！如您已确认无误，请点击右下角确认按钮提交表单！</p>
      </Modal>
      <Button style="margin-left: 30px" @click="goback">返回</Button>
    </div>
  </Form>
</template>

<script>
  import photosBox from '@/components/common/upLoadPhotosList/photosBox'
  import swiper from '@/components/common/swiper/swiper'

  export default {
    name: "renGouForm",
    components: {
      photosBox,
      swiper,
    },
    data() {
      return {
        submitModal: false,
        renGouInfo: {
          id: null,
          house_id: null,
          project_id: null,
          subscribe_a_price: 0,
          subscribe_price: 0,
          subscribe_img: [],
          subscribe_time: null,
        },
        renGouRules: {
          subscribe_price: [
            {
              required: true,
              type: 'number',
              message: '实际补缴认购金不能为空',
              trigger: 'blur'
            }
          ],
          subscribe_time: [
            {
              required: true,
              type: 'date',
              message: '认购时间不能为空',
              trigger: 'blur'
            }
          ],
          subscribe_img: [
            {
              required: true,
              type: 'array',
              message: '文件不能为空',
              trigger: 'blur'
            }
          ],
        },
        // 认购协议轮必填列表
        renGouImgList: [],
        // 是否上传认购协议
        isUploadRenGou: false,
        // 是否展示认购协议轮播图
        isShowRenGouSwiper: false,
        // 要认购的客户列表
        renGouClientList: [],
        // 临时存储要认购的客户信息
        renGouClientInfo: {},
        // 上传协议时指定的认筹客户id
        customerId: null,
        // 是否只读
        readOnly: false
      }
    },
    props: ['editSalesInfo', 'allClientList', 'currentStateNum', 'globalReadOnly'],
    created() {
      // 获取到唯一的认购客户的信息（因为可能有多人认筹，但是最终只能有一个客户进入认购阶段，其他没进入的状态改为‘解筹’）
      var renGouClient = this.editSalesInfo.renchou.row_number.find(item => {
        return item.state === '认筹中'
      })
      // 需要补缴的认购金额
      var subscribe_a_price = this.editSalesInfo.activity.subscribe_price - renGouClient.price
      this.renGouInfo.subscribe_a_price = subscribe_a_price > 0 ? subscribe_a_price : 0

      // 认购部分的数据渲染
      var renGouInfo = this.editSalesInfo.subscribe
      if (renGouInfo) {
        this.readOnly = true
        // console.log('认购的相关信息===', renGouInfo)
        this.renGouInfo.subscribe_price = renGouInfo.price
        this.renGouInfo.subscribe_img = JSON.parse(renGouInfo.img)
        this.renGouInfo.subscribe_time = renGouInfo.subscribe_time
        var renGouImgList = this.renGouImgList
        if (this.renGouInfo.subscribe_img.length > 0) {
          // console.log('subscribe_img=====', this.renGouInfo.subscribe_img)
          this.renGouInfo.subscribe_img.forEach(item => {
            renGouImgList.push({
              avatar: item.url
            })
          })
        }
        this.renGouImgList = renGouImgList
        // console.log('格式化之后的轮播图数据',this.renGouImgList)
      }

      // 获取到买受人列表
      var renGouClientList = this.editSalesInfo.house.only_people
      // console.log('买受人列表===========', renGouClientList)
      if (renGouClientList.length > 0) {
        renGouClientList.forEach(item => {
          item.name = item.customer.name
          item.phone = this.formatPhone(item.customer.phone)
          if (item.is_main) {
            item.is_check = true
          } else {
            item.is_check = false
          }
        })
        this.renGouClientList = renGouClientList
      }
    },
    methods: {
      goback() {
        this.$emit('goback')
      },
      /*
      *  提交认购表单
      * */
      submitRenGou() {
        var renGouInfo = this.renGouInfo
        if (!this.renGouInfo.subscribe_time) return this.$Message.error('请选择认购时间！')
        if (!this.renGouInfo.subscribe_price) return this.$Message.error('请输入实际认缴金额！')
        if (!this.renGouInfo.subscribe_img.length) return this.$Message.error('请上传认购文件！')

        var renGouFormInfo = {
          id: this.editSalesInfo.id,
          project_id: parseInt(this.$route.params.id),
          house_id: this.editSalesInfo.house.id,
          renchou_price: renGouInfo.subscribe_a_price,
          subscribe_time: this.formatTime(new Date(renGouInfo.subscribe_time)),
          subscribe_img: renGouInfo.subscribe_img,
          subscribe_price: renGouInfo.subscribe_price,
        }
        this.$emit('submitRenGou', renGouFormInfo)
      },
      cancelSubmit() {
        this.$Message.info('取消提交表单！')
      },
      /*
     * 去上传认购协议
     * */
      gotoUploadRenGou() {
        this.isUploadRenGou = true
      },
      /*
      *  上传认购协议
      * */
      addRengouPhotos(res) {
        // console.log('认购协议的图片==========', res)
        this.renGouInfo.subscribe_img = res
        this.isUploadRenGou = false
        var renGouImgList = this.renGouImgList
        res.forEach(item => {
          renGouImgList.push({
            avatar: item.url
          })
        })
        this.renGouImgList = renGouImgList
      },
      /*
       * 取消上传协议
       * */
      closePicBox() {
        this.isUploadRenGou = false
      },
      /*
      *  以轮播图方式展示认购图片
      * */
      showRenGouSwiper() {
        this.isShowRenGouSwiper = true
      },
      /*
      *  隐藏轮播图展示框
      * */
      cancelShowRenGouSwiper() {
        this.isShowRenGouSwiper = false
      },
      /*
      *  获取到要添加认购的客户列表
      * */
      getRenGouClientInfo(id) {
        this.renGouClientInfo = this.allClientList.find(item => {
          return item.id === id
        })
      },
      /*
     *  添加认购客户信息
     * */
      addRenGouClient() {
        // console.log('添加认购客户信息', this.renGouClientInfo)
        if (this.globalReadOnly) return this.$Message.error('不可编辑！')
        var renGouClientInfo = this.renGouClientInfo
        if (!renGouClientInfo.id) return this.$Message.error('请选择认购客户！')
        renGouClientInfo = {
          name: renGouClientInfo.name,
          phone: this.formatPhone(renGouClientInfo.phone),
          is_check: false,
          is_main: 0,
          customer_id: renGouClientInfo.id
        }
        // console.log('当前加入认购的客户==', renGouClientInfo)
        var hasSameClient = this.renGouClientList.some(item => {
          return item.customer_id === renGouClientInfo.customer_id
        })
        if (hasSameClient) return this.$Message.error('当前客户已认购！')
        this.renGouClientList.push(renGouClientInfo)
        // console.log('已加入认筹的客户', this.clientList)
      },
      /*
      *  删除买受人
      * */
      deleteRenGouClient(id) {
        if (this.currentStateNum > 2 || this.globalReadOnly) return this.$Message.error('当前不可编辑该表单！')
        var renGouClientList = this.renGouClientList
        renGouClientList.forEach((item, index) => {
          if (item.id === id) {
            renGouClientList.splice(index, 1)
          }
        })
        this.renGouClientList = renGouClientList
      },
      /*
     *  提交认购的客户信息
     * */
      submitRenGouList() {
        var renGouClientList = this.renGouClientList
        var count = 0
        renGouClientList.forEach(item => {
          if (item.is_check) {
            item.is_main = 1
            count++
          } else {
            item.is_main = 0
          }
        })
        if (count === 0) {
          return this.$Message.error('请设置主买受人！')
        }
        if (count > 1) {
          return this.$Message.error('只能设置一名主买受人！')
        }
        var info = {
          project_id: parseInt(this.$route.params.id),
          house_id: this.editSalesInfo.house.id,
          people: renGouClientList,
          follow_id: this.editSalesInfo.id
        }
         this.$post('/follow/addPeopleCustomer', info).then(res => {
           if (res.data === '没有权限') {
             this.$Modal.error({
               title: '警告',
               content: '没有权限'
             })
             return false
           }
           if (res.status_code !== 200) return this.$Message.error('添加认购客户信息失败！')
           this.$Message.success('添加认购客户信息成功！')
         }).catch(err => {
           this.$Message.error('添加认购客户信息失败！')
           console.log(err)
         })
      },
      /*
      * 格式化电话
      * */
      formatPhone(p) {
        return p.slice(0, 3) + '****' + p.slice(7, 11)
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
    }
  }
</script>

<style scoped>
  .ren_gou_form {
    padding: 0;
    margin: 0;
  }
</style>
