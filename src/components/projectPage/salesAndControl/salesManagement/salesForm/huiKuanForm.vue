<template>
  <Form class="hui_kuan_form" ref="huiKuanForm" :model="huiKuanInfo" :rules="huiKuanRules" :label-width="90">
    <!--添加回款记录-->
    <Row style="padding-left: 30px">
      <Col span="6">
        <FormItem label="回款记录：">
          <div style="display: flex">
            <InputNumber
              style="width: 100%;min-width: 120px"
              :min="0"
              :max="needPayback"
              :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => `${value}`.replace(/￥\s?|(,*)/g, '')"
              v-model="huiKuanInfo.received_price"
              placeholder="请输入回款金额"
              :disabled="currentStateNum>4 || readOnly || globalReadOnly"
            ></InputNumber>
            <span style="margin-left: 6px">元</span>
          </div>
        </FormItem>
      </Col>
      <Col span="4" offset="1">
        <DatePicker
          style="width: 100%;"
          v-model="huiKuanInfo.received_time"
          placeholder="请输入回款时间"
          :disabled="currentStateNum>4 || readOnly || globalReadOnly"
        ></DatePicker>
      </Col>
      <Col span="4" offset="1">
        <Input
          style="width: 100%;"
          placeholder="请输入备注"
          v-model="huiKuanInfo.desc"
          :disabled="currentStateNum>4 || readOnly || globalReadOnly"
        ></Input>
      </Col>
      <Col span="4" offset="1">
        <div v-if="currentHuiKuanId" style="display: flex">
          <Button type="primary" @click="editPaybackList">修改回款记录</Button>
          <Button @click="cancelEdit" style="margin-left: 15px">取消修改</Button>
        </div>
        <Button v-else type="primary" @click="addPaybackList" :disabled="readOnly || globalReadOnly">添加回款记录</Button>
      </Col>
    </Row>
    <Row>
      <Col>
        <div style="padding: 0 50px;color: #348EED">
          <span>剩余应收款：</span>
          <span v-if="needPayback">{{needPayback}}元</span>
          <span v-else>回款完毕，请进入下一个阶段操作！</span>
        </div>
      </Col>
    </Row>
    <!--回款记录-->
    <div class="payback_table" style="padding: 30px">
      <Table border :columns="paybackColumns" :data="paybackList"></Table>
    </div>
    <div style="padding: 0 30px;">
      <span style="color: red;">提示：</span>
      <span>请手动切入回款阶段，否则可能导致回款错误！</span>
    </div>
    <!--提交回款表单-->
    <div class="btn_wrap" v-if="currentStateNum===4 && !globalReadOnly">
      <Button
        type="primary"
        @click="submitModal=true"
      >{{isGoToJiaoFang ? '切入回款阶段' :'切入交房阶段'}}
      </Button>
      <Modal
        v-model="submitModal"
        title="请确认是否要提交该表单"
        @on-ok="submitHuiKuan"
        @on-cancel="cancelSubmit">
        <p style="color: red">注意：确认后部分内容不可更改！如您已确认无误，请点击右下角确认按钮提交表单！</p>
      </Modal>
      <Button style="margin-left: 30px" @click="goback">返回</Button>
    </div>
  </Form>
</template>

<script>
  export default {
    name: "huiKuanForm",
    data() {
      return {
        submitModal: false,
        huiKuanInfo: {
          // 回款金额
          received_price: null,
          // 回款时间
          received_time: null,
          // 回款备注
          desc: null,
        },
        huiKuanRules: {},
        paybackColumns: [
          {
            title: '回款金额（元）',
            align: 'center',
            width: 220,
            key: 'received_price'
          },
          {
            title: '回款日期',
            align: 'center',
            width: 160,
            key: 'received_time'
          },
          {
            title: '备注',
            align: 'center',
            key: 'desc',
            render: (h, params) => {
              if (!params.row.desc) {
                return h('div', [
                  h('span', {}, '暂无备注'),
                ])
              } else {
                return h('div', [
                  h('span', {}, params.row.desc),
                ])
              }
            }
          },
          {
            title: '操作',
            align: 'center',
            width: 160,
            key: 'action',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    disabled: this.currentStateNum > 4 || this.readOnly || this.globalReadOnly
                  },
                  style: {
                    color: '#2d8cf0'
                  },
                  on: {
                    click: () => {
                      this.gotoEditPaybackList(params.row)
                    }
                  }
                }, '修改'),
                h('Button', {
                  props: {
                    type: 'text',
                    disabled: this.currentStateNum > 4 || this.readOnly || this.globalReadOnly
                  },
                  style: {
                    color: '#FF2F2F'
                  },
                  on: {
                    click: () => {
                      this.remove(params.row.id)
                    }
                  }
                }, '删除'),
              ])
            }
          },
        ],
        // 回款记录
        paybackList: [],
        // 剩余需要缴纳的回款金额
        needPayback: null,
        // 当前编辑中的回款id
        currentHuiKuanId: null,
        // 当前编辑的回款的金额（临时存储）
        currentHuiKuanPrice: null,
        readOnly: false,
        isGoToJiaoFang: false
      }
    },
    props: ['editSalesInfo', 'currentStateNum', 'globalReadOnly'],
    created() {
      this.getUnPayPrice()
    },
    methods: {
      getUnPayPrice() {
        var id = this.editSalesInfo.id
        this.$post('/follow/signList', {follow_id: id}).then(res => {
          if (res.status_code !== 200) return this.$Message.error('未获取到应付款金额！')
          var needPayback = res.data.sign.un_pay_price
          // console.log('未付款的相关消息===', needPayback)
          this.needPayback = parseInt(needPayback)
          if (this.needPayback <= 0 || !this.needPayback) {
            this.isGoToJiaoFang = true
          }

          var received_payment = this.editSalesInfo.received_payment
          if (received_payment.received_payment_table.length) {
            // this.readOnly = true
            var paybackList = received_payment.received_payment_table
            var hadPayback = 0
            paybackList.forEach(item => {
              item.received_time = this.formatTime(new Date(item.received_time))
              hadPayback += item.received_price
            })
            this.paybackList = paybackList
            this.needPayback = parseInt(needPayback - hadPayback)
            if (this.needPayback === 0) {
              this.readOnly = true
            }
            // this.needPayback = 0
          }

        }).catch(err => {
          this.$Message.error('未获取到应付款金额！')
          console.log(err)
        })
      },
      goback() {
        this.$emit('goback')
      },
      /*
      *  添加回款记录
      * */
      addPaybackList() {
        var huiKuanInfo = this.huiKuanInfo
        if (this.needPayback <= 0) return this.$Message.error('回款完毕，请进入下一个阶段操作！')
        if (!huiKuanInfo.received_price) return this.$Message.error('回款金额不能为空')
        if (!huiKuanInfo.received_time) return this.$Message.error('回款时间不能为空')
        var received = {
          project_id: parseInt(this.$route.params.id),
          follow_id: this.editSalesInfo.id,
          received_price: huiKuanInfo.received_price,
          received_time: this.formatTime(huiKuanInfo.received_time),
          desc: huiKuanInfo.desc,
        }
        this.$post('/follow/addReceivedPayment', received).then(res => {
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('添加回款记录失败！')
          this.$Message.success('添加回款记录成功！')

          var result = res.data
          this.paybackList.unshift({
            id: result.id,
            received_price: result.received_price,
            received_time: this.formatTime(new Date(result.received_time.date)),
            desc: result.desc,
          })
          this.needPayback -= parseInt(result.received_price)
          this.huiKuanInfo = {
            received_price: null,
            received_time: null,
            desc: null,
          }
        }).catch(err => {
          this.$Message.error('添加回款记录失败！')
          console.log(err)
        })
      },
      /*
      *  去修改回款记录
      * */
      gotoEditPaybackList(info) {
        if (this.currentHuiKuanId) {
          this.cancelEdit()
        }
        this.huiKuanInfo = {
          received_price: parseInt(info.received_price),
          received_time: info.received_time,
          desc: info.desc,
        }
        this.currentHuiKuanId = info.id
        this.currentHuiKuanPrice = info.received_price

        this.needPayback += parseInt(info.received_price)
      },
      /*
      * 取消编辑回款记录
      * */
      cancelEdit() {
        this.needPayback -= parseInt(this.currentHuiKuanPrice)
        this.currentHuiKuanPrice = null
        this.huiKuanInfo = {
          received_price: null,
          received_time: null,
          desc: null,
        }
        this.currentHuiKuanId = null
      },
      /*
      *  修改回款记录
      * */
      editPaybackList() {
        var paybackInfo = {
          id: this.currentHuiKuanId,
          received_price: this.huiKuanInfo.received_price,
          received_time: this.formatTime(this.huiKuanInfo.received_time),
          desc: this.huiKuanInfo.desc,
        }
        if (!paybackInfo.received_price) return this.$Message.error('回款金额不能为空')
        if (!paybackInfo.received_time) return this.$Message.error('回款时间不能为空')

        this.$post('/follow/updateReceivedPayment', paybackInfo).then(res => {
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('编辑失败！')
          this.$Message.success('编辑成功！')

          var result = res.data
          this.paybackList.forEach(item => {
            if (item.id === result.id) {
              // item.id = result.id
              item.received_price = result.received_price
              item.received_time = this.formatTime(new Date(result.received_time.date))
              item.desc = result.desc
            }
          })
          this.needPayback -= parseInt(result.received_price)

          this.huiKuanInfo = {
            received_price: null,
            received_time: null,
            desc: null,
          }
          this.currentHuiKuanPrice = null
          this.currentHuiKuanId = null
        }).catch(err => {
          this.$Message.error('编辑失败！')
          console.log(err)
        })

      },
      /*
     *  删除回款记录
     * */
      remove(id) {
        this.$post('/follow/deleteReceivedPayment', {id: id}).then(res => {
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('删除回款记录失败！')
          this.$Message.success('删除回款记录成功！')
          var list = this.paybackList
          list.forEach((item, index) => {
            if (item.id === id) {
              this.needPayback += parseInt(item.received_price)
              list.splice(index, 1)
            }
          })
          this.paybackList = list
        }).catch(err => {
          this.$Message.error('删除回款记录失败！')
          console.log(err)
        })
      },
      /*
      *  提交回款表单
      * */
      submitHuiKuan() {
        var huiKuanInfo = {
          project_id: parseInt(this.$route.params.id),
          id: this.editSalesInfo.id,
          house_id: this.editSalesInfo.house.id
        }
        this.$emit('submitHuiKuan', huiKuanInfo)
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

<style lang="less" scoped>
  .hui_kuan_form {

  }
</style>
