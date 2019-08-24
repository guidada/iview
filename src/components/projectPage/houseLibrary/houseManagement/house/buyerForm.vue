<template>
  <Card class="buyer_form_container">
    <Form class="form" ref="houseForm" :model="buyerInfo" :rules="houseRules" :label-width="120">
      <!-- 房源信息-->
      <Row>
        <Col span="6">
          <FormItem label="房源号：">
            <div>{{editHouseInfo.house_num}}</div>
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem label="销售状态：">
            <div>{{editHouseInfo.state}}</div>
          </FormItem>
        </Col>
        <Col span="6">
          <Button type="primary" @click="gotoViewHistory">历史记录</Button>
        </Col>
      </Row>
      <!--主买受人信息-->
      <Row style="margin-bottom: 20px">
        <Col>
          <h2>主买受人</h2>
        </Col>
      </Row>
      <div class="form_item">
        <Row>
          <Col span="5">
            <FormItem label="姓名：">
              <div>{{buyerInfo.name}}</div>
            </FormItem>
          </Col>
          <Col span="6" offset="1">
            <FormItem label="联系方式：">
              <div>{{buyerInfo.phone}}</div>
            </FormItem>
          </Col>
          <Col span="11" offset="1">
            <FormItem label="身份证号：">
              <div>{{buyerInfo.idcard}}</div>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="备注：">
              <div>{{buyerInfo.desc || '无'}}</div>
            </FormItem>
          </Col>
          <Col span="11" offset="1">
            <FormItem label="身份证正反面：">
              <div style="display:flex;">
                <a target="_blank" :href="buyerInfo.positive_photo">正面</a>
                <a target="_blank" :href="buyerInfo.negative_photo">反面</a>
              </div>
            </FormItem>
          </Col>
        </Row>
      </div>
      <!-- 共同买受人信息-->
      <Row style="margin-bottom: 20px">
        <Col>
          <h2>共同买受人</h2>
        </Col>
      </Row>
      <!-- customer-->
      <div v-if="buyerList.length" class="buyer_list_wrap">
        <buyerList
          :buyerList="buyerList"
        ></buyerList>
      </div>
      <div v-if="!buyerList.length" class="no_buyer_list form_item">暂无共同买受人</div>
    </Form>
    <!-- 历史记录-->
    <Modal
      v-model="isShowHistory"
      title="历史记录"
      width="1000px"
    >
      <historyForm
        :historyList="historyList"
      ></historyForm>
    </Modal>
    <!--提交按钮-->
    <div class="btn_wrap">
      <Button type="info" @click="cancelEditHouse">确认</Button>
      <Button style="margin-left: 20px;" @click="cancelEditHouse">返回</Button>
    </div>
  </Card>
</template>

<script>
  import historyForm from './historyForm'
  import buyerList from './buyerList'

  export default {
    name: "buyerForm",
    components: {
      historyForm,
      buyerList,
    },
    data() {
      return {
        isShowHistory: false,
        // 主买受人信息
        buyerInfo: {
          name: '123',
          type: []
        },
        // 共同买受人列表
        buyerList: [],
        houseRules: {},
        historyList: [],
      }
    },
    props: ['editHouseInfo', 'currentBuildingInfo','isForbid'],
    created() {
      var list = []
      // console.log('editHouseInfo==========', this.editHouseInfo)
      if (this.editHouseInfo.only_people.length) {
        this.editHouseInfo.only_people.forEach(item => {
          if (item.is_main) {
            this.buyerInfo = item.customer
          } else {
            list.push(item)
          }
          this.buyerList = list || []
        })
      }

    },
    methods: {
      /*
     * 取消编辑房源
     * */
      cancelEditHouse() {
        this.$emit('cancelEditHouse')
      },
      /*
      *  去查看历史记录
      * */
      gotoViewHistory() {
        this.isShowHistory = true
        this.getHistoryList()
      },
      /*
      * 获取到历史记录
      * */
      getHistoryList() {
        this.$post('/house/mainPeopleHistory', {house_id: this.editHouseInfo.id}).then(res => {
          // console.log('获取历史记录=====', res)
          if (res.status_code !== 200) return this.$Message.error('获取历史记录失败')
          this.$Message.success('获取历史记录成功')
          var result = res.data.people
          var list = []
          result.forEach((item, index) => {
            list.push({
              name: item.customer.name,
              phone: item.customer.phone,
              idcard: item.customer.idcard,
              positive_photo: item.customer.positive_photo,
              negative_photo: item.customer.negative_photo,
              updated_at: this.formatTime(new Date(item.customer.updated_at)),
            })
          })
          this.historyList = list
        }).catch(err => {
          this.$Message.error('获取历史记录失败')
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
    }
  }
</script>

<style lang="less" scoped>
  .buyer_form_container {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .form {

      .form_item {
        background-color: #f7f7f7;
        margin-bottom: 3px;
      }

      .buyer_list_wrap {
        height: 280px;
        overflow-y: scroll;
      }

      .no_buyer_list {
        text-align: center;
        color: #aaa;
        font-size: 16px;
        line-height: 280px;
      }

      a {
        color: #348EED;
        margin-right: 10px;
      }
    }

    .btn_wrap {
      display: flex;
      justify-content: center;
      margin-top: 30px;
    }
  }

</style>
