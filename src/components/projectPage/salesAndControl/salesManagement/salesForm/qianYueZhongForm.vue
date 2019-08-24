<template>
  <Form class="qian_yue_zhong_form" ref="qianYueZhongForm" :model="qianYueZhongInfo" :rules="qianYueZhongRules"
        :label-width="135">
    <!-- 原签约总价-->
    <Row>
      <Col span="11">
        <FormItem label="原签约总价：" prop="sign_price">
          <div style="display: flex">
            <!--:disabled="currentStateNum>2 || readOnly || globalReadOnly"-->
            <InputNumber
              style="width: 100%"
              :min="1"
              :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => `${value}`.replace(/￥\s?|(,*)/g, '')"
              v-model="qianYueZhongInfo.b_total_price"
              placeholder="请输入签约总价"
              disabled
            ></InputNumber>
            <span style="margin-left: 10px">元</span>
          </div>
        </FormItem>
      </Col>
    </Row>
    <!--优惠后签约总价-->
    <Row>
      <Col span="11">
        <FormItem label="优惠后签约总价：" prop="sign_price">
          <div style="display: flex">
            <!--:disabled="currentStateNum>2 || readOnly || globalReadOnly"-->
            <InputNumber
              style="width: 100%"
              :min="1"
              :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => `${value}`.replace(/￥\s?|(,*)/g, '')"
              v-model="qianYueZhongInfo.sign_price"
              placeholder="请输入签约总价"
              disabled
            ></InputNumber>
            <span style="margin-left: 10px">元</span>
          </div>
        </FormItem>
      </Col>
    </Row>
    <!--付款方式-->
    <Row>
      <Col span="11">
        <FormItem label="付款方式：" prop="payment">
          <Select
            v-model="qianYueZhongInfo.payment"
            placeholder="请选择付款方式"
            :disabled="currentStateNum>2 || readOnly || globalReadOnly">
            <Option v-for="(item, index) in payList" :value="item" :key="index">{{item}}</Option>
          </Select>
        </FormItem>
      </Col>
    </Row>
    <!--收款方式-->
    <Row>
      <Col span="11">
        <FormItem label="收款方式：" prop="gathering">
          <Select
            v-model="qianYueZhongInfo.gathering"
            placeholder="请选择收款方式"
            :disabled="currentStateNum>2 || readOnly || globalReadOnly">
            <Option v-for="(item, index) in receiptList" :value="item" :key="index">{{item}}</Option>
          </Select>
        </FormItem>
      </Col>
    </Row>
    <!--首付金额-->
    <Row>
      <Col span="11">
        <FormItem label="首付金额：" prop="down_payment">
          <div style="display: flex">
            <InputNumber
              style="width: 100%"
              :min="1"
              :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => `${value}`.replace(/￥\s?|(,*)/g, '')"
              :max="qianYueZhongInfo.sign_price"
              v-model="qianYueZhongInfo.down_payment"
              placeholder="请输入首付金额"
              :disabled="currentStateNum>2 || readOnly || globalReadOnly"
            ></InputNumber>
            <span style="margin-left: 10px">元</span>
          </div>
        </FormItem>
      </Col>
    </Row>
    <!--首付付款时间-->
    <Row>
      <Col span="11">
        <FormItem label="首付付款时间：" prop="down_payment_time">
          <DatePicker
            style="width: 100%"
            type="date"
            v-model="qianYueZhongInfo.down_payment_time"
            placeholder="请输入首付付款时间"
            :disabled="currentStateNum>2 || readOnly || globalReadOnly"
          ></DatePicker>
        </FormItem>
      </Col>
    </Row>
    <!-- 优惠金额 根据是否有优惠单显示结果-->
    <Row>
      <Col span="24">
        <FormItem label="优惠金额：">
          <div v-if="discount_list">
            存在【优惠申请单】
            <span style="color: #348EED">{{discount_list.number}}</span>
            优惠金额：
            <span style="color: #348EED">{{discount_list.discount_price}}元</span>
          </div>
          <div v-else>该房源无【优惠申请单】</div>
        </FormItem>
      </Col>
    </Row>

    <!--提交签约中表单-->
    <div class="btn_wrap" v-if="currentStateNum===2 && !globalReadOnly">
      <Button
        type="primary"
        @click="checkRenGou"
        v-if="!readOnly"
      >确定</Button>
      <Modal
        v-model="submitModal"
        title="请确认是否要提交该表单"
        @on-ok="submitQIanYueZhong"
        @on-cancel="cancelSubmit">
        <p style="color: red">注意：确认后部分内容不可更改！如您已确认无误，请点击右下角确认按钮提交表单！</p>
      </Modal>
      <Modal
        v-model="checkRenGouModal"
        title="请完善认购客户信息"
      >
        <p style="color: red">警告：认购客户信息不存在，请完善认购客户信息！</p>
      </Modal>
      <Button style="margin-left: 30px" @click="goback">返回</Button>
    </div>
  </Form>
</template>

<script>
  export default {
    name: "qianYueZhong",
    data() {
      return {
        submitModal: false,
        checkRenGouModal: false,
        qianYueZhongInfo: {
          // 签约总价
          sign_price: null,
          // 付款方式
          payment: '',
          // 收款方式
          gathering: '',
          // 首付
          down_payment: null,
          // 首付时间
          down_payment_time: null,
        },
        qianYueZhongRules: {
          sign_price: [
            {
              required: true,
              type: 'number',
              message: '签约总价不能为空',
              trigger: 'blur'
            }
          ],
          payment: [
            {
              required: true,
              message: '付款方式不能为空',
              trigger: 'blur'
            }
          ],
          gathering: [
            {
              required: true,
              message: '收款方式不能为空',
              trigger: 'blur'
            }
          ],
          down_payment: [
            {
              required: true,
              type: 'number',
              message: '首付金额不能为空',
              trigger: 'blur'
            }
          ],
          down_payment_time: [
            {
              required: true,
              type: 'date',
              message: '首付时间不能为空',
              trigger: 'blur'
            }
          ],
        },
        // 付款方式
        payList: ['一次性付款', '按揭付款', '分期付款', '公积金贷款'],
        // 收款方式
        receiptList: ['pos', '现金', '银行转账'],
        // 优惠单
        discount_list: null,
        // 认筹金额
        renchou_price: null,
        readOnly:false
      }
    },
    props: ['editSalesInfo', 'currentStateNum','globalReadOnly'],
    created() {
      // 获取到唯一的认购客户的信息（因为可能有多人认筹，但是最终只能有一个客户进入认购阶段，其他没进入的状态改为‘解筹’）
      var renGouClient = this.editSalesInfo.renchou.row_number.find(item => {
        return item.state === '认筹中'
      })
      this.renchou_price = renGouClient.price

      this.discount_list = this.editSalesInfo.discount_list
      var qianYueZhongInfo = this.editSalesInfo.qianyue
      this.qianYueZhongInfo.sign_price = parseFloat(this.editSalesInfo.sign_price)
      this.qianYueZhongInfo.b_total_price = parseFloat(this.editSalesInfo.house.b_total_price)
      if (qianYueZhongInfo) {
        this.readOnly = true
        this.qianYueZhongInfo = {
          id: this.editSalesInfo.id,
          project_id: parseInt(this.$route.params.id),
          house_id: this.editSalesInfo.house.id,
          renchou_price: this.renchou_price,
          sign_price: parseFloat(this.editSalesInfo.sign_price),
          b_total_price: parseFloat(this.editSalesInfo.house.b_total_price),
          payment: qianYueZhongInfo.payment,
          gathering: qianYueZhongInfo.gathering,
          down_payment: qianYueZhongInfo.down_payment,
          down_payment_time: qianYueZhongInfo.down_payment_time,
        }
      }
    },
    methods: {
      goback() {
        this.$emit('goback')
      },
      checkRenGou() {
        var renGouClientList = this.editSalesInfo.house.only_people
        if (renGouClientList.length) {
          this.submitModal = true
        } else {
          this.$Message.error('请完善认购客户信息！')
          this.checkRenGouModal = true
        }
      },
      /*
      *  签约表单
      * */
      submitQIanYueZhong() {
        var info = this.qianYueZhongInfo
        if (!info.sign_price) return this.$Message.error('签约总价不能为空')
        if (!info.payment) return this.$Message.error('付款方式不能为空')
        if (!info.gathering) return this.$Message.error('收款方式不能为空')
        if (!info.down_payment) return this.$Message.error('首付金额不能为空')
        if (!info.down_payment_time) return this.$Message.error('首付时间不能为空')
        var qianYueZhongInfo = {
          id: this.editSalesInfo.id,
          project_id: parseInt(this.$route.params.id),
          house_id: this.editSalesInfo.house.id,
          renchou_price: this.renchou_price,
          sign_price: info.sign_price,
          payment: info.payment,
          gathering: info.gathering,
          down_payment: info.down_payment,
          down_payment_time: this.formatTime(info.down_payment_time),
        }
        this.$emit('submitQIanYueZhong', qianYueZhongInfo)
      },
      cancelSubmit() {
        this.$Message.info('取消提交表单！')
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
  .qian_yue_zhong_form {
    padding: 0;
    margin: 0;
  }
</style>
