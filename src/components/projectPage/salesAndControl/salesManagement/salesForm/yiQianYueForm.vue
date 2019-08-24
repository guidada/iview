<template>
  <div v-if="isUploadQianYue" class="pic_box">
    <photosBox
      style="padding: 0 20px"
      :toSelect="true"
      :count="1"
      @canclePhotos="closePicBox"
      @addPhotos="addQianYuePhotos"
    ></photosBox>
  </div>
  <div v-else-if="isGuanLianHeTong">
    <guanLianHeTong
      :houseNum="houseNum"
      :heTongInfo="heTongInfo"
      @submitFormSuccess="submitFormSuccess"
      @cancelSunmit="cancelSunmit"
    ></guanLianHeTong>
  </div>
  <Form v-else class="yi_qian_yue_form" ref="yiQianYueForm" :model="yiQianYueInfo" :rules="yiQianYueRules"
        :label-width="135">
    <!--关联合同单号-->
    <Row>
      <Col span="24">
        <FormItem label="关联合同单号：" prop="contract_id">
          <div>
            <a
              style="color: #348EED"
              v-if="yiQianYueInfo.contract_id"
              :href="yiQianYueInfo.contract_img"
              target="_blank"
            >{{yiQianYueInfo.contract_num}}</a>
            <span v-else>未关联合同，请关联合同</span>
            <Button
              style="color: #348EED;margin-left: 20px"
              @click="gotoAddContract"
              :disabled="currentStateNum>3 || readOnly || globalReadOnly"
            >关联合同
            </Button>
          </div>
        </FormItem>
      </Col>
    </Row>
    <!--上传签约审批单-->
    <Row>
      <Col span="24">
        <FormItem label="上传签约审批单：" prop="yiqianyue_avatar">
          <div style="display: flex">
            <Button icon="ios-cloud-upload-outline"
                    @click="gotoUploadQianYue"
                    :disabled="currentStateNum>3 || readOnly || globalReadOnly"
            >上传签约审批单
            </Button>
            <a v-if="yiQianYueInfo.yiqianyue_avatar"
               style="margin-left: 20px;color: #348EED"
               target="_blank"
               :href="yiQianYueInfo.yiqianyue_avatar">查看签约审批单</a>
          </div>
        </FormItem>
      </Col>
    </Row>
    <!--提交签约中表单-->
    <div class="btn_wrap" v-if="currentStateNum===3 && !globalReadOnly">
      <Button
        type="primary"
        @click="submitModal=true"
        v-if="!readOnly"
      >确定
      </Button>
      <Modal
        v-model="submitModal"
        title="请确认是否要提交该表单"
        @on-ok="submitYiQIanYue"
        @on-cancel="cancelSubmit">
        <p style="color: red">注意：确认后部分内容不可更改！如您已确认无误，请点击右下角确认按钮提交表单！</p>
      </Modal>
      <Button style="margin-left: 30px" @click="goback">返回</Button>
    </div>
  </Form>
</template>

<script>
  import photosBox from '@/components/common/upLoadPhotosList/photosBox'
  import guanLianHeTong from './guanLianHeTong'

  // let Base64 = require('js-base64').Base64

  export default {
    name: "yiQianYueForm",
    components: {
      photosBox,
      guanLianHeTong,
    },
    data() {
      return {
        submitModal: false,
        yiQianYueInfo: {
          contract_num: '',
          contract_id: null,
          contract_img: '',
          yiqianyue_avatar: '',
        },
        yiQianYueRules: {
          yiqianyue_avatar: [
            {
              required: true,
              trigger: 'blur'
            }
          ],
          contract_id: [
            {
              required: true,
              trigger: 'blur'
            }
          ],
        },
        readOnly: false,
        // 关联的合同信息
        contract: null,
        // 是否上传签约审批单
        isUploadQianYue: false,
        isGuanLianHeTong: false,
        houseNum: null,
        heTongInfo:{}
      }
    },
    props: ['editSalesInfo', 'currentStateNum', 'globalReadOnly'],
    created() {
      var contract = this.editSalesInfo.house.contract
      if (contract) {
        // console.log('关联的合同==',contract)
        this.contract = contract
        this.yiQianYueInfo.contract_num = contract.number
        this.yiQianYueInfo.contract_id = contract.id
        this.yiQianYueInfo.contract_img = JSON.parse(contract.img)[0]
      }

      var yiqianyue = this.editSalesInfo.yiqianyue
      if (yiqianyue) {
        this.readOnly = true
        this.yiQianYueInfo.yiqianyue_avatar = yiqianyue.avatar
      }
      // console.log('已签约的信息===', this.yiQianYueInfo)
    },
    methods: {
      goback() {
        this.$emit('goback')
      },
      /*
      *  提交已签约表单
      * */
      submitYiQIanYue() {
        if (!this.yiQianYueInfo.yiqianyue_avatar) return this.$Message.error('请上传签约审批单！')
        if (!this.yiQianYueInfo.contract_id) return this.$Message.error('请关联合同！')
        var yiQianYueInfo = {
          id: this.editSalesInfo.id,
          project_id: parseInt(this.$route.params.id),
          house_id: this.editSalesInfo.house.id,
          yiqianyue_avatar: this.yiQianYueInfo.yiqianyue_avatar,
          contract_id: this.yiQianYueInfo.contract_id,
        }
        this.$emit('submitYiQIanYue', yiQianYueInfo)
      },
      cancelSubmit() {
        this.$Message.info('取消提交表单！')
      },
      /*
      * 打开图片选择盒子
      * */
      gotoUploadQianYue() {
        this.isUploadQianYue = true
      },
      /*
      * 关闭图片盒子
      * */
      closePicBox() {
        this.isUploadQianYue = false
      },
      /*
      * 添加签约审批单
      * */
      addQianYuePhotos(res) {
        // console.log('选择的图片', res)
        this.yiQianYueInfo.yiqianyue_avatar = res
        this.isUploadQianYue = false
      },
      /*
      *  去关联合同
      * */
      gotoAddContract() {
        this.isGuanLianHeTong = true
        this.houseNum = this.editSalesInfo.house.house_num
        if (this.yiQianYueInfo.contract_id) {
          this.heTongInfo = {
            project_id: parseInt(this.$route.params.id),
            building_id: this.editSalesInfo.house.building_id,
            unit_id: this.editSalesInfo.house.unit_id,
            room: this.editSalesInfo.house.room,
            img: [this.yiQianYueInfo.contract_img],
          }
        } else {
          this.heTongInfo = {
            project_id: parseInt(this.$route.params.id),
            building_id: this.editSalesInfo.house.building_id,
            unit_id: this.editSalesInfo.house.unit_id,
            room: this.editSalesInfo.house.room,
            img: [],
          }
        }
      },
      submitFormSuccess(res) {
        this.isGuanLianHeTong = false
        this.yiQianYueInfo.contract_num = res.number
        this.yiQianYueInfo.contract_id = res.id
        this.yiQianYueInfo.contract_img = res.img[0]
      },
      cancelSunmit() {
        this.isGuanLianHeTong = false
        this.$Message.error('取消关联合同')
      },
    }
  }
</script>

<style scoped>

</style>
