<template>
  <div class="view_favorable_container">
    <h2>{{isShenPi?'审批':'查看'}}优惠单</h2>
    <Form ref="form" :label-width="135">
      <!-- 状态-->
      <Row>
        <Col span="10">
          <FormItem label="管理项目：">
            <div>{{currentViewInfo.project.name}}</div>
          </FormItem>
        </Col>
        <Col span="10" offset="1">
          <FormItem label="审批状态：">
            <div>{{currentViewInfo.state}}</div>
          </FormItem>
        </Col>
      </Row>
      <!-- 关联房源-->
      <Row>
        <Col span="5" style="min-width: 225px">
          <FormItem label="关联房源：" prop="house_id">
            <div>{{currentViewInfo.house.house_num}}</div>
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
              <Row style="padding: 0 30px">
                <Col :span="8">
                  房源状态：{{currentViewInfo.house.state}}
                </Col>
                <Col :span="8">
                  客户姓名：{{currentViewInfo.customer.name}}
                </Col>
                <Col :span="8">
                  客户联系方式：{{currentViewInfo.customer.phone}}
                </Col>
              </Row>
            </div>
          </FormItem>
        </Col>
      </Row>
      <!-- 优惠方式-->
      <Row>
        <Col span="10">
          <FormItem label="优惠方式：">
            <span>
              签约总价的基础上优惠
            </span>
          </FormItem>
        </Col>
      </Row>
      <!-- 优惠金额-->
      <Row>
        <Col span="10">
          <FormItem label="优惠金额：">
            <!--<div>{{currentViewInfo.discount_price}}</div>-->
            <InputNumber
              style="min-width: 120px;"
              :min="1"
              :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => `${value}`.replace(/￥\s?|(,*)/g, '')"
              :max="currentViewInfo.sign_price || 10000"
              v-model="currentViewInfo.discount_price"
              placeholder="请输入优惠金额"
              :disabled="!isEditFavorable"
            ></InputNumber>
          </FormItem>
        </Col>
      </Row>
      <!-- 签约价-->
      <Row>
        <Col span="10">
          <FormItem label="优惠后签约价：">
            <div style="color: #348EED">
              {{(currentViewInfo.sign_price - currentViewInfo.discount_price)}}元
            </div>
          </FormItem>
        </Col>
        <Col span="10" offset="1">
          <FormItem label="优惠前签约价：">
            <div>{{currentViewInfo.sign_price}}元</div>
          </FormItem>
        </Col>
      </Row>
      <!-- 备注-->
      <Row>
        <Col span="10">
          <FormItem label="备注：">
            <div>
              <Input type="textarea" v-model="currentViewInfo.infos" :disabled="!isEditFavorable"></Input>
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
          @click="editFavorableForm('修改')"
          :disabled="!isEditFavorable"
        >确认修改
        </Button>
        <Button
          type="warning"
          @click="editFavorableForm('取消')"
          :disabled="!isEditFavorable"
          style="margin-left: 30px"
        >取消申请
        </Button>
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
  export default {
    name: "viewFavorable",
    data() {
      return {
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
        currentcurrentViewInfo: {}
      }
    },
    props: ['viewInfo', 'isShenPi', 'isEditFavorable'],
    created() {
      var viewInfo = this.viewInfo
      viewInfo.sign_price = parseFloat(viewInfo.sign_price)
      viewInfo.discount_price = parseFloat(viewInfo.discount_price)

      this.currentViewInfo = viewInfo
      this.approveList = this.currentViewInfo.discount_list_follow
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
          id: this.currentViewInfo.id,
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
          id: this.currentViewInfo.id,
          type: '驳回',
          reject: this.reject
        }
        this.submitForm(info)
      },
      /*
      * 审批处理
      * */
      submitForm(data) {
        this.$post('/discount/followDiscountList', data).then(res => {
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('提交审批失败！')
          if (res.data === '请去添加价格权限或添加的职务和房源价格权限中的职务相同') return this.$Message.error('请去添加价格权限或添加的职务和房源价格权限中的职务相同！')
          if (res.data === '你没有权限通过') return this.$Message.error('你没有权限通过！')
          this.$Message.success('提交审批成功！')
          this.$emit('submitSuccess')
        }).catch(err => {
          this.$Message.error('提交审批失败！')
          console.log(err)
        })
      },
      /*
      * 修改优惠单驳回申请表单
      * */
      editFavorableForm(type) {
        var discount_price = this.currentViewInfo.discount_price
        var sign_price = this.currentViewInfo.sign_price
        if (!discount_price) return this.$Message.error('优惠金额不能为空！')
        if (discount_price > sign_price) return this.$Message.error('优惠金额超出可容许范围！')
        var favorableFormInfo = {
          project_id: parseInt(this.$route.params.id),
          discount_id: this.currentViewInfo.id,
          discount_price: discount_price,
          sign_price: sign_price,
          type: type,
          infos: this.currentViewInfo.infos
        }
        // console.log('修改后要提交的信息===', favorableFormInfo)
        this.$post('/discount/updateDiscountList', favorableFormInfo).then(res => {
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('新建优惠单失败！')
          this.$Message.success('新建优惠单成功！')
          this.$emit('editSuccess')
        }).catch(err => {
          this.$Message.error('新建优惠单失败！')
          console.log(err)
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .view_favorable_container {
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
