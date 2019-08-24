<template>
  <div class="add_favorable_container">
    <h2>新建优惠单</h2>
    <Form :model="favorableFormInfo" ref="form" :label-width="135" :rules="formRules">
      <!-- 状态-->
      <Row>
        <Col span="10">
          <FormItem label="管理项目：">
            <div>{{projectInfo.name}}</div>
          </FormItem>
        </Col>
        <Col span="10" offset="1">
          <FormItem label="审批状态：">
            <div>{{isAddFavorable?'待新建':'审核中'}}</div>
          </FormItem>
        </Col>
      </Row>
      <!-- 关联房源-->
      <Row>
        <Col span="5" style="min-width: 225px">
          <FormItem label="关联房源：" prop="house_id">
            <Select v-model="favorableFormInfo.building" placeholder="楼栋" @on-change="getUnitList">
              <Option v-for="(item, index) in building" :value="item.id" :key="index">{{item.building_num}}幢</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="3" style="min-width: 100px">
          <FormItem :label-width="1">
            <Select v-model="favorableFormInfo.unit" placeholder="单元" @on-change="getHouseList">
              <Option v-for="(item, index) in unit" :value="item.id" :key="index">{{item.unit_num}}单元</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="3" style="min-width: 100px">
          <FormItem :label-width="1">
            <Select v-model="favorableFormInfo.house_id" placeholder="房源" @on-change="getHouseInfo">
              <Option v-for="(item, index) in house" :value="item.id" :key="index">{{item.room}}</Option>
            </Select>
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
              <Row style="padding: 0 30px" v-if="clientInfo.id">
                <Col :span="8">
                  房源状态：{{clientInfo.state}}
                </Col>
                <Col :span="8">
                  客户姓名：{{clientInfo.customer.name}}
                </Col>
                <Col :span="8">
                  客户联系方式：{{clientInfo.customer.phone}}
                </Col>
              </Row>
              <Row style="padding: 0 30px;" v-else>
                <div>温馨提示：当前未选择房源(或)当前房源状态未处于 <span style="color: red">已认购</span> 状态,无法新建优惠单</div>
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
          <FormItem label="优惠金额：" prop="discount_price">
            <InputNumber
              style="min-width: 120px;"
              :min="1"
              :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => `${value}`.replace(/￥\s?|(,*)/g, '')"
              :max="houseInfo.maxPrice || 10000"
              v-model="favorableFormInfo.discount_price"
              placeholder="请输入优惠金额"
            ></InputNumber>
          </FormItem>
        </Col>
      </Row>
      <!-- 签约价-->
      <Row>
        <Col span="10">
          <FormItem label="优惠后签约价：">
            <div style="color: #348EED">
              {{(houseInfo.sign_price - favorableFormInfo.discount_price) || '0'}}元
            </div>
          </FormItem>
        </Col>
        <Col span="10" offset="1">
          <FormItem label="优惠前签约价：">
            <div>{{houseInfo.sign_price || '0'}}元</div>
          </FormItem>
        </Col>
      </Row>
      <!-- 备注-->
      <Row>
        <Col span="10">
          <FormItem label="备注：">
            <div>
              <Input type="textarea" v-model="favorableFormInfo.desc" placeholder="请输入备注"></Input>
            </div>
          </FormItem>
        </Col>
      </Row>
      <!-- 提交按钮-->
      <div class="btn_wrap">
        <Button type="primary" @click="submitFavorable">保存</Button>
        <Button type="default" style="margin-left: 30px" @click="goback">取消</Button>
      </div>
    </Form>
  </div>
</template>

<script>

  export default {
    name: "clientCreate",
    data() {
      return {
        // 楼栋列表
        building: [],
        // 当前选择的楼栋
        building_id: null,
        // 单元列表
        unit: [],
        // 房源列表
        house: [],
        // 选中的房源信息
        houseInfo: {},
        // 选中的房源的客户信息
        clientInfo: {},

        favorableFormInfo: {
          project_id: this.$route.params.id,
          name: '',
          desc: '',
          discount_price: null,
          building: null,
          unit: null,
          house_id: null,
        },
        formRules: {
          discount_price: [{required: true, type: 'number', message: '优惠金额不能为空', trigger: 'blur'}],
          house_id: [{required: true, type: 'number', message: '房源不能为空', trigger: 'blur'}],
        },

      }
    },
    props: ['projectInfo', 'isAddFavorable'],
    created() {
      this.getBuildingList(parseInt(this.$route.params.id))
    },
    methods: {
      goback() {
        this.$emit('cancelAdd')
      },
      /*
     *  获取到楼栋列表的基本配置
     * */
      getBuildingList(project_id) {
        this.$post('discount/discountListConfig', {project_id: project_id}).then(res => {
          if (res.status_code !== 200) return this.$Message.error('获取房源失败！')
          this.building = res.data.building
        }).catch(err => {
          this.$Message.error('获取房源失败！')
        })
      },
      /*
       *  获取到当前选择的楼栋的单元信息
       * */
      getUnitList(building_id) {
        this.building_id = building_id
        var info = {
          project_id: parseInt(this.$route.params.id),
          building_id: building_id
        }
        this.$post('discount/discountListConfig', info).then(res => {
          if (res.status_code !== 200) return this.$Message.error('获取房源失败！')
          this.favorableFormInfo.unit = ''
          this.favorableFormInfo.house_id = null
          this.unit = res.data.unit
          this.clientInfo = {}
          this.houseInfo = {}
        }).catch(err => {
          this.$Message.error('获取房源失败！')
          console.log(err)
        })
      },
      /*
      * 获取到当前选择的楼栋的指定单元的房源
      * */
      getHouseList(unit_id) {
        var info = {
          project_id: parseInt(this.$route.params.id),
          building_id: this.building_id,
          unit_id: unit_id,
        }
        this.$post('discount/discountListConfig', info).then(res => {
          if (res.status_code !== 200) return this.$Message.error('获取房源失败！')
          this.favorableFormInfo.house_id = null
          this.house = res.data.house
          this.clientInfo = {}
          this.houseInfo = {}
        }).catch(err => {
          this.$Message.error('获取房源失败！')
        })
      },
      /*
      *  获取到房源信息
      * */
      getHouseInfo(house_id) {
        var result = this.house.find(item => {
          return item.id === house_id
        })
        this.houseInfo = result
        this.houseInfo.maxPrice = parseFloat(this.houseInfo.sign_price)

        if (result && result.follow_history.length > 0) {
          this.clientInfo = result.follow_history[0]
        } else {
          this.clientInfo = {}
        }
      },
      /*
      *  提交优惠单申请
      * */
      submitFavorable() {
        var info = this.favorableFormInfo
        if (!info.house_id) return this.$Message.error('请选择房源！')
        if (!info.discount_price) return this.$Message.error('优惠金额不能为空！')
        if (info.discount_price > this.houseInfo.sign_price) return this.$Message.error('优惠金额超出可容许范围！')
        var favorableFormInfo = {
          project_id: parseInt(this.$route.params.id),
          sign_price: this.houseInfo.sign_price,
          discount_price: info.discount_price,
          house_id: info.house_id,
          infos: info.desc
        }
        this.$post('/discount/addDiscountList',favorableFormInfo).then(res=>{
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          if(res.status_code!==200) return this.$Message.error('新建优惠单失败！')
          if(res.data ==='该房源已经申请过优惠单了或优惠单正在审核中') return this.$Message.error('该房源已经申请过优惠单了或优惠单正在审核中！')
          this.$Message.success('新建优惠单成功！')
          this.$emit('addSuccess')
        }).catch(err=>{
          this.$Message.error('新建优惠单失败！')
          console.log(err)
        })
      },
    }
  }
</script>

<style lang="less" scoped>
  .add_favorable_container {
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
  }
</style>
