<template>
  <Form class="jiao_fang_form" ref="jiaoFangForm" :model="jiaoFangInfo" :rules="jiaoFangRules" :label-width="135">
    <!--实测面积-->
    <Row>
      <Col span="7">
        <FormItem label="实测面积：" prop="true_mianji">
          <div style="display: flex">
            <InputNumber
              style="width: 100%;min-width: 120px"
              :min="0"
              :max="10000"
              v-model="jiaoFangInfo.true_mianji"
              placeholder="请输入实测面积"
              :disabled="currentStateNum>5 || readOnly || globalReadOnly"
            ></InputNumber>
            <span style="margin-left: 10px">㎡</span>
          </div>
        </FormItem>
      </Col>
      <Col span="5" offset="2">
        <FormItem label="合同建筑面积：">
          <div style="display: flex">{{heTongMianJi}}㎡</div>
        </FormItem>
      </Col>
      <Col span="7" offset="1">
        <FormItem label="面积补差放款：" prop="price_differences">
          <div style="display: flex">
            <InputNumber
              style="width: 100%;"
              :min="0"
              :max="99999999"
              :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => `${value}`.replace(/￥\s?|(,*)/g, '')"
              v-model="jiaoFangInfo.price_differences"
              placeholder="请输入补差款"
              :disabled="currentStateNum>5 || readOnly || globalReadOnly"
            ></InputNumber>
            <span style="margin-left: 10px">元</span>
          </div>
        </FormItem>
      </Col>
    </Row>
    <!--交房事项确认-->
    <Row>
      <Col span="12">
        <FormItem label="交房事项确认：">
          <div style="color: #aaaaaa">
            其中(<span style="color: red">带*号</span>)的必填事项,必须填写才可进入下一阶段；
          </div>
        </FormItem>
      </Col>
      <Col  span="11" offset="1" v-if="editSalesInfo.state !== '交房'">
        <FormItem label="温馨提示：">
          <div style="color: #aaaaaa">
            请先点击 <span style="color: #348EED">切换到交房</span> 按钮，将进度切换到交房阶段，然后完善交房事项
          </div>
        </FormItem>
      </Col>
    </Row>
    <!--事项列表-->
    <div class="client_list_wrap">
      <table class="table_wrap" cellspacing="0">
        <thead>
        <tr>
          <th>项目</th>
          <th>收费标准</th>
          <th>费用(元)</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in caseList" :key="item.id">
          <td>
            <span v-if="item.is_main" style="font-size: 14px;color: red;">*</span>
            <span>{{item.name}}</span>
          </td>
          <td>{{item.desc}}</td>
          <td>
            <InputNumber
              style="width: 100%"
              :min="0"
              :max="99999999"
              v-model="item.price"
              placeholder="请输入认筹金额"
              :disabled="currentStateNum>5 || readOnly || globalReadOnly"
            ></InputNumber>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <!--提交交房表单按钮-->
    <div class="btn_wrap" v-if="currentStateNum===5 && !globalReadOnly">
      <Button
        type="primary"
        @click="submitModal=true"
      >{{ editSalesInfo.state === '交房' ? '确定' : '切换到交房' }}
      </Button>
      <Modal
        v-model="submitModal"
        title="请确认是否要提交该表单"
        @on-ok="submitJiaoFang"
        @on-cancel="cancelSubmit">
        <p style="color: red">注意：确认后部分内容不可更改！如您已确认无误，请点击右下角确认按钮提交表单！</p>
      </Modal>
      <Button style="margin-left: 30px" @click="goback">返回</Button>
    </div>
  </Form>
</template>

<script>
  export default {
    name: "jiaoFangForm",
    data() {
      return {
        submitModal: false,
        // 合同面积
        heTongMianJi: null,
        jiaoFangInfo: {
          true_mianji: null,
          price_differences: null,
        },
        jiaoFangRules: {
          true_mianji: [
            {
              required: true,
              type: 'number',
              message: '实测面积不能为空',
              trigger: 'blur'
            }
          ],
          price_differences: [
            {
              required: true,
              type: 'number',
              message: '补差款不能为空',
              trigger: 'blur'
            }
          ],
        },
        // 交房事项确认列表
        caseList: [],
        readOnly: false,
      }
    },
    props: ['editSalesInfo', 'currentStateNum','globalReadOnly'],
    created() {
      this.heTongMianJi = this.editSalesInfo.house.mianji
      this.jiaoFangInfo.true_mianji = parseInt(this.editSalesInfo.house.true_mianji) || null
      var caseList = []
      if (this.editSalesInfo.reach_house && this.editSalesInfo.reach_house.reach_house_table.length) {
        var reach_house_table = this.editSalesInfo.reach_house.reach_house_table
        this.readOnly = true
        this.jiaoFangInfo.price_differences = parseInt(this.editSalesInfo.reach_house.price_differences) || null
        reach_house_table.forEach(item => {
          caseList.push({
            name: item.name,
            price: parseInt(item.price),
            desc: item.desc,
            is_main: item.is_main,
          })
        })
        this.caseList = caseList
      } else {
        var project_reach_config = this.editSalesInfo.project.project_reach_config
        project_reach_config.forEach(item => {
          caseList.push({
            name: item.name,
            price: null,
            desc: item.desc,
            is_main: item.is_main,
          })
        })
        this.caseList = caseList
      }
    },
    methods: {
      goback() {
        this.$emit('goback')
      },
      /*
      *  交房表单提交
      * */
      submitJiaoFang() {
        var info = this.jiaoFangInfo
        var flag = false
        if (!info.true_mianji) return this.$Message.error('实测面积不能为空！')
        if (info.price_differences === null || info.price_differences === undefined) return this.$Message.error('补差款不能为空！')
        this.caseList.forEach(item => {
          if (item.is_main === 1 && !item.price) {
            flag = true
          }
        })
        if (flag) return this.$Message.error('必填交房事项未全部完结！')
        var jiaoFangInfo = {
          id: this.editSalesInfo.id,
          project_id: parseInt(this.$route.params.id),
          house_id: this.editSalesInfo.house.id,
          true_mianji: info.true_mianji,
          price_differences: info.price_differences,
          arr_reach: this.caseList
        }
        this.$emit('submitJiaoFang', jiaoFangInfo)
      },
      cancelSubmit() {
        this.$Message.info('取消提交表单！')
      },
    }
  }
</script>

<style lang="less" scoped>

</style>
