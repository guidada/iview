<template>
  <div class="edit_sales_management_container">
    <!--主体内容-->
    <Tabs type="card" :value="currentTab">
      <TabPane label="销控处理" name="baseInfo">
        <!--步骤条-->
        <Steps :current="currentStep" size="small" style="padding: 0 50px">
          <Step title="认筹"></Step>
          <Step title="认购"></Step>
          <Step title="签约中"></Step>
          <Step title="已签约"></Step>
          <Step title="回款"></Step>
          <Step title="交房"></Step>
          <Step title="办证"></Step>
          <Step title="完毕"></Step>
        </Steps>
        <!--表单部分 :rules="projectRules"-->
        <Form class="form" ref="salesForm" :model="salesInfo" :rules="salesRules" :label-width="135">
          <!--项目管理 和 状态管理-->
          <Row>
            <Col span="11">
              <FormItem label="关联项目：">
                <div class="text">{{editSalesInfo.project.name}}</div>
              </FormItem>
            </Col>
            <Col span="11" offset="2">
              <FormItem label="销售状态：">
                <Select v-model="salesInfo.state" @on-change="changeState" :disabled="isReadOnly">
                  <Option
                    v-for="(item, index) in stateList"
                    :value="item.name"
                    :key="index"
                    :disabled="item.disabled"
                  >{{item.name}}
                  </Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <!--折叠板，包含所有状态的表单-->
          <Collapse v-model="currentStateForm" accordion>
            <!--todo 认筹部分-->
            <Panel name="认筹" v-if="currentStateNum>=0">
              <span class="panel_title">认筹</span>
              <div slot="content">
                <renChou
                  :editSalesInfo="editSalesInfo"
                  :currentStateNum="currentStateNum"
                  :allClientList="allClientList"
                  :guwenList="guwenList"
                  :globalReadOnly="isReadOnly"
                  @goback="goback"
                  @submitRenChou="submitRenChou"
                ></renChou>
              </div>
            </Panel>
            <!--todo 认购-->
            <Panel name="认购" v-if="currentStateNum>=1">
              <span class="panel_title">认购</span>
              <div slot="content">
                <renGou
                  :editSalesInfo="editSalesInfo"
                  :currentStateNum="currentStateNum"
                  :globalReadOnly="isReadOnly"
                  :allClientList="allClientList"
                  @goback="goback"
                  @submitRenGou="submitRenGou"
                ></renGou>
              </div>
            </Panel>
            <!--TODO 签约中-->
            <Panel name="签约中" v-if="currentStateNum>=2">
              <span class="panel_title">签约中</span>
              <div slot="content">
                <qianYueZhong
                  :editSalesInfo="editSalesInfo"
                  :globalReadOnly="isReadOnly"
                  @goback="goback"
                  :currentStateNum="currentStateNum"
                  @submitQIanYueZhong="submitQIanYueZhong"
                ></qianYueZhong>
              </div>
            </Panel>
            <!--TODO 已签约-->
            <Panel name="已签约" v-if="currentStateNum>=3">
              <span class="panel_title">已签约</span>
              <div slot="content">
                <yiQianYue
                  :editSalesInfo="editSalesInfo"
                  :currentStateNum="currentStateNum"
                  :globalReadOnly="isReadOnly"
                  @goback="goback"
                  @submitYiQIanYue="submitYiQIanYue"
                ></yiQianYue>
              </div>
            </Panel>
            <!--todo 回款-->
            <Panel name="回款" v-if="currentStateNum>=4">
              <span class="panel_title">回款</span>
              <div slot="content">
                <huiKuan
                  :editSalesInfo="editSalesInfo"
                  :currentStateNum="currentStateNum"
                  :globalReadOnly="isReadOnly"
                  @goback="goback"
                  @submitHuiKuan="submitHuiKuan"
                ></huiKuan>
              </div>
            </Panel>
            <!--todo 交房-->
            <Panel name="交房" v-if="currentStateNum>=5">
              <span class="panel_title">交房</span>
              <div slot="content">
                <jiaoFang
                  :editSalesInfo="editSalesInfo"
                  :currentStateNum="currentStateNum"
                  :globalReadOnly="isReadOnly"
                  @goback="goback"
                  @submitJiaoFang="submitJiaoFang"
                ></jiaoFang>
              </div>
            </Panel>
            <!--todo 办证-->
            <Panel name="办证" v-if="currentStateNum>=6">
              <span class="panel_title">办证</span>
              <div slot="content">
                <banZheng
                  :editSalesInfo="editSalesInfo"
                  :currentStateNum="currentStateNum"
                  :globalReadOnly="isReadOnly"
                  @goback="goback"
                  @submitBanZheng="submitBanZheng"
                ></banZheng>
              </div>
            </Panel>
          </Collapse>
          <!-- 提交按钮-->
          <div class="btn_wrap" v-if="isReadOnly || currentStateNum===7">
            <Button style="margin-left: 30px" @click="goback">返回</Button>
          </div>
        </Form>
      </TabPane>
      <TabPane label="历史记录" name="historyInfo">
        <history
          :historyList="historyList"
          :noDataText="noDataText"
        ></history>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
  import history from './salesForm/history'
  import photosBox from '@/components/common/upLoadPhotosList/photosBox'
  import renChou from './salesForm/renChouForm'
  import renGou from './salesForm/renGouForm'
  import qianYueZhong from './salesForm/qianYueZhongForm'
  import yiQianYue from './salesForm/yiQianYueForm'
  import huiKuan from './salesForm/huiKuanForm'
  import jiaoFang from './salesForm/jiaoFangForm'
  import banZheng from './salesForm/banZhengForm'

  let Base64 = require('js-base64').Base64

  export default {
    components: {
      history,
      photosBox,
      renChou,
      renGou,
      qianYueZhong,
      yiQianYue,
      huiKuan,
      jiaoFang,
      banZheng,
    },
    data() {
      return {
        // 默认的表单选项
        currentTab: 'baseInfo',
        // 历史记录列表
        historyList: [],
        // 销控表的信息
        salesInfo: {
          state: '',
        },
        // 销控单验证规则
        salesRules: {},
        // 销控状态列表
        stateList: [
          {
            num: 0,
            name: "认筹中",
            disabled: true,
          },
          {
            num: 1,
            name: "已认购",
            disabled: true,
          },
          {
            num: 2,
            name: "签约中",
            disabled: true,
          },
          {
            num: 3,
            name: "已签约",
            disabled: true,
          },
          {
            num: 4,
            name: "回款",
            disabled: true,
          },
          {
            num: 5,
            name: "交房",
            disabled: true,
          },
          {
            num: 6,
            name: "办证",
            disabled: true,
          },
          {
            num: 7,
            name: "已完结",
            disabled: true,
          }
        ],
        // 当前的状态值
        currentStateNum: 0,
        // 当前进度
        currentStep: 0,
        // 当前状态显示的表单
        currentStateForm: '',
        // 要编辑的状态
        editState: '',
        // 所有的客户列表
        allClientList: [],
        // 顾问列表
        guwenList: [],
        noDataText:'暂无数据'
      }
    },
    props: ['isReadOnly', 'editSalesInfo'],
    created() {
      // 认筹部分的数据渲染
      this.salesInfo.house_id = this.editSalesInfo.house.id
      this.salesInfo.id = this.editSalesInfo.id
      var subscribe_a_price = this.editSalesInfo.activity.subscribe_price - this.editSalesInfo.renchou.row_number[0].price
      this.salesInfo.subscribe_a_price = subscribe_a_price > 0 ? subscribe_a_price : 0

      this.getHistoryList()
      this.getCurrentState()
      this.getCustomerAndGuWen()
    },
    methods: {
      goback() {
        this.$emit('cancelEdit')
      },
      /*
      *  获取到历史记录列表
      * */
      getHistoryList() {
        this.$post('/follow/followHistoryInfo', {follow_id: this.editSalesInfo.id}).then(res => {
          if (res.data === '没有权限') {
            this.noDataText = '没有权限'
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('获取历史记录失败！')
          var followHistoryInfo = res.data.followHistoryInfo
          followHistoryInfo.forEach(item => {
            item.worker_name = Base64.decode(item.worker.name) + '/' + item.worker.job
          })
          this.historyList = followHistoryInfo
        }).catch(err => {
          this.$Message.error('获取历史记录失败！')
          console.log(err)
        })
      },
      /*
      *  获取到当前项目的状态,
      * 把当前状态设置为可编辑，
      * 同时设置当前状态的下一个状态为可编辑，
      * 其他状态则为不可编辑状态
      * */
      getCurrentState() {
        var currentState = this.editSalesInfo.state
        this.getCurrentStepAndFormByState(currentState)

        var stateList = this.stateList
        stateList.forEach((item, index) => {
          if (item.name === currentState) {
            item.disabled = false
            this.currentStateNum = item.num
            this.salesInfo.state = item.name
            if (stateList[index + 1]) {
              stateList[index + 1].disabled = false
            }
          }
        })
      },
      /*
      *  通过当前的状态获取到进度，和表单
      * */
      getCurrentStepAndFormByState(state) {
        this.editState = state
        switch (state) {
          case '认筹中' :
            this.currentStep = 0
            this.currentStateForm = '认筹'
            this.currentStateNum = 0
            break
          case '已认购' :
            this.currentStep = 1
            this.currentStateForm = '认购'
            this.currentStateNum = 1
            break
          case '签约中' :
            this.currentStep = 2
            this.currentStateForm = '签约中'
            this.currentStateNum = 2
            break
          case '已签约' :
            this.currentStep = 3
            this.currentStateForm = '已签约'
            this.currentStateNum = 3
            break
          case '回款' :
            this.currentStep = 4
            this.currentStateForm = '回款'
            this.currentStateNum = 4
            break
          case '交房' :
            this.currentStep = 5
            this.currentStateForm = '交房'
            this.currentStateNum = 5
            break
          case '办证' :
            this.currentStep = 6
            this.currentStateForm = '办证'
            this.currentStateNum = 6
            break
          case '已完结' :
            this.currentStep = 7
            this.currentStateForm = '办证'
            this.currentStateNum = 7
            break
          default:
          // this.$router.go(0)
        }
      },
      /*
      *  切换状态的时候获取到指定状态的表单,虽然切换成功了，但是表单未展开
      * */
      changeState(state) {
        this.getCurrentStepAndFormByState(state)
      },
      /*
     * 获取到客户列表和置业顾问列表
     * */
      getCustomerAndGuWen() {
        this.$post('/follow/customerCondition', {project_id: parseInt(this.$route.params.id)}).then(res => {
          if (res.status_code !== 200) return this.$Message.error('获取顾问失败！')
          this.guwenList = res.data.zygw
          this.allClientList = res.data.customer
        }).catch(err => {
          this.$Message.error('获取顾问失败！')
        })
      },
      /*
      *  处理认筹部分的表单提交
      * */
      submitRenChou(renChouInfo) {
        this.$post('/follow/renchouCustomer', renChouInfo).then(res => {
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('编辑销控单失败！')
          var flag = this.isPostFail(res)
          if (flag) return false
          // if (res.data === '存在解筹申请') return this.$Message.error('存在解筹申请！')
          // if (res.data === '请完善数据') return this.$Message.error('请完善数据！')
          // if (res.data === '填写的优惠单申请在审核中') return this.$Message.error('填写的优惠单申请在审核中！')
          // if (res.data === '跟进认筹失败') return this.$Message.error('跟进认筹失败,可能存在多名认筹客户处于认筹中！')
          this.$Message.success('编辑销控单成功！')
          this.$emit('editSuccess')
        }).catch(err => {
          this.$Message.error('编辑销控单失败！')
          console.log(err)
        })
      },
      /*
      *  处理认购部分的表单提交
      * */
      submitRenGou(renGouInfo) {
        this.$post('/follow/followHistory', renGouInfo).then(res => {
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('认购失败！')
          var flag = this.isPostFail(res)
          if (flag) return false
          // if (res.data === '请完善数据') return this.$Message.error('请完善数据！')
          // if (res.data === '填写退认购金申请在审核中') return this.$Message.error('填写退认购金申请在审核中！')
          // if (res.data === '填写的优惠单申请在审核中') return this.$Message.error('填写的优惠单申请在审核中！')
          // if (res.data === '填写退认购金申请在审核中') return this.$Message.error('填写退认购金申请在审核中！')
          // if (res.data === '请完善签约中数据') return this.$Message.error('请完善签约中数据！')
          // if (res.data === '跟进认筹失败') return this.$Message.error('跟进认筹失败,可能存在多名认筹客户处于认筹中！')
          this.$Message.success('认购成功！')
          this.$emit('editSuccess')
        }).catch(err => {
          this.$Message.error('认购失败！')
          console.log(err)
        })
      },
      /*
      *  处理签约中的表单提交
      * */
      submitQIanYueZhong(qianYueZhongInfo) {
        this.$post('/follow/followHistory', qianYueZhongInfo).then(res => {
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('签约失败！')
          var flag = this.isPostFail(res)
          if (flag) return false
          // if (res.data === '请完善签约中数据') return this.$Message.error('请完善签约中数据！')
          // if (res.data === '申请的优惠单在审核中') return this.$Message.error('申请的优惠单在审核中！')
          // if (res.data === '填写退认购金申请在审核中') return this.$Message.error('填写退认购金申请在审核中！')
          // if (res.data === '填写的优惠单申请在审核中') return this.$Message.error('填写的优惠单申请在审核中！')
          // if (res.data === '填写退认购金申请在审核中') return this.$Message.error('填写退认购金申请在审核中！')
          // if (res.data === '请完善签约中数据') return this.$Message.error('请完善签约中数据！')
          // if (res.data === '请完善已签约数据') return this.$Message.error('请完善已签约数据！')
          // if (res.data === '填写退房申请在审核中') return this.$Message.error('填写退房申请在审核中！')
          // if (res.data === '跟进失败') return this.$Message.error('跟进失败！')
          this.$Message.success('签约成功！')
          this.$emit('editSuccess')
        }).catch(err => {
          this.$Message.error('签约失败！')
          console.log(err)
        })
      },
      /*
      *  处理已签约的表单提交
      * */
      submitYiQIanYue(yiQianYueInfo) {
        this.$post('/follow/followHistory', yiQianYueInfo).then(res => {
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('已签约跟进失败！')
          var flag = this.isPostFail(res)
          if (flag) return false
          // if (res.data === '请完善已签约数据') return this.$Message.error('请完善已签约数据！')
          // if (res.data === '填写退房申请在审核中') return this.$Message.error('填写退房申请在审核中！')
          // if (res.data === '跟进失败') return this.$Message.error('跟进失败！')
          this.$Message.success('已签约跟进成功！')
          this.$emit('editSuccess')
        }).catch(err => {
          this.$Message.error('已签约跟进失败！')
          console.log(err)
        })
      },
      /*
      *  处理回款记录表单提交
      * */
      submitHuiKuan(huiKuanInfo) {
        this.$post('/follow/followHistory', huiKuanInfo).then(res => {
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('提交回款失败！')
          var flag = this.isPostFail(res)
          if (flag) return false
          // if (res.data === '回款金额少于签约总价') return this.$Message.error('回款金额少于签约总价！')
          // if (res.data === '跟进失败') return this.$Message.error('跟进失败！')
          this.$Message.success('提交回款跟进成功！')
          this.$emit('editSuccess')
        }).catch(err => {
          this.$Message.error('提交回款失败！')
          console.log(err)
        })
      },
      /*
      *  处理交房事项表单提交
      * */
      submitJiaoFang(jiaoFangInfo) {
        this.$post('/follow/followHistory', jiaoFangInfo).then(res => {
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('提交交房事项失败！')
          var flag = this.isPostFail(res)
          if (flag) return false
          // if (res.data === '请完善交房数据') return this.$Message.error('请完善交房数据！')
          // if (res.data === '跟进失败') return this.$Message.error('跟进失败！')
          this.$Message.success('提交交房事项跟进成功！')
          this.$emit('editSuccess')
        }).catch(err => {
          this.$Message.error('提交交房事项失败！')
          console.log(err)
        })
      },
      //  处理办证表单提交
      submitBanZheng(banZhengInfo) {
        this.$post('/follow/followHistory', banZhengInfo).then(res => {
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('提交办证事项失败！')
          var flag = this.isPostFail(res)
          if (flag) return false
          // if (res.data === '请完善交房数据') return this.$Message.error('请完善交房数据！')
          // if (res.data === '跟进失败') return this.$Message.error('跟进失败！')
          this.$Message.success('提交办证事项跟进成功！')
          this.$emit('editSuccess')
        }).catch(err => {
          this.$Message.error('提交办证事项失败！')
          console.log(err)
        })
      },
      /*
      * 判断提交的数据是否被服务器拒绝了
      * 以后有新的相关拦截都添加到 dataList
      * */
      isPostFail(res) {
        var dataList = ['跟进失败', '失败', '存在解筹申请', '多人认筹未发生解筹处理','认购失败；多人认筹未发生解筹处理',  '请完善数据', '填写的优惠单申请在审核中', '跟进认筹失败', '跟进认筹失败,可能存在多名认筹客户处于认筹中', '请完善数据', '填写退认购金申请在审核中', '填写的优惠单申请在审核中', '填写退认购金申请在审核中', '请完善签约中数据', '跟进认筹失败', '认购失败', '跟进认购失败', '签约失败', '跟进签约失败', '请完善签约中数据', '申请的优惠单在审核中', '填写退认购金申请在审核中', '填写的优惠单申请在审核中', '填写退认购金申请在审核中', '请完善签约中数据', '请完善已签约数据', '填写退房申请在审核中', '跟进失败', '请完善已签约数据', '填写退房申请在审核中', '跟进失败', '回款金额少于签约总价', '交房失败', '跟进交房失败', '请完善交房数据']
        if (dataList.indexOf(res.data) > -1) {
          this.$Message.error(res.data)
          return true
        } else {
          return false
        }
      }
    }
  }
</script>

<style lang="less">
  .edit_sales_management_container {
    padding: 30px;

    /*标签*/
    .ivu-tabs-nav-scroll {
      background-color: #f2f2f2;
    }
    .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-nav-container {
      height: 71px;
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
      border: 0;
    }
    .ivu-col {
      min-width: 165px;
    }

    /*进度条*/
    .ivu-steps-item .ivu-steps-tail i {
      height: 4px;
    }

    /*表单部分*/
    .form {
      padding: 50px 0;

      .text {
        font-size: 14px;
      }

      .ivu-collapse > .ivu-collapse-item > .ivu-collapse-header > i {
        font-size: 18px;
      }

      .panel_title {
        font-size: 16px;
        font-weight: bold;
      }

      .active_info_wrap {
        background-color: #f2f2f2;
        margin: 0 80px 30px;
        padding: 20px 10px;

        h3 {
          color: #aaaaaa;
        }

        .active_content {
          margin-top: 15px;
          margin-left: 2em;
          span {
            margin-right: 40px;
          }

        }
      }

      .add_client_btn {
        color: #1999DD;
        font-size: 40px;
        margin-left: 30px;
        font-weight: bold;
        cursor: pointer;

        &:hover {
          color: #1c49bf;
        }
      }

      .client_list_wrap {
        padding: 0 80px;
        .table_wrap {
          width: 100%;
          min-height: 30px;
          line-height: 30px;
          text-align: center;
          border-collapse: collapse;
          padding: 2px;

          thead {
            background-color: #f2f2f2;
          }

          th,
          td {
            padding: 10px;
            width: 14.3%;
            min-width: 80px;

            .delete_btn {
              color: #1999DD;
              font-size: 30px;
              cursor: pointer;

              &:hover {
                color: red;
              }
            }
          }
        }
      }

      .case_list_wrap {
        background-color: #f2f2f2;
        padding: 15px 50px;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;

        span {
          display: inline-block;
          width: 33.3333%;
          text-align: center;
          margin: 10px 0;
        }
      }

      .btn_wrap {
        display: flex;
        justify-content: center;
        margin-top: 30px;
      }
    }

    .ivu-form .ivu-form-item-label {
      font-size: 14px;
    }

  }
</style>
