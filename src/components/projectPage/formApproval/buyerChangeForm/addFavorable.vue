<template>
  <div class="project-container">
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
              </Row>
              <Row style="padding: 0 30px;" v-else>
                <div>温馨提示：当前未选择房源(或)当前房源状态未处于 <span style="color: red">已认购</span> 状态,无法新建优惠单</div>
              </Row>
              <Row v-if="clientInfo.id">
                <h4 style="font-size: 14px">
                  主受卖人信息
                </h4>
              </Row>
              <Row style="padding: 0 30px" v-if="clientInfo.id">
                <Col :span="8">
                  客户姓名：{{clientInfo&&clientInfo.name || ''}}
                </Col>
                <Col :span="8">
                  客户联系方式：{{clientInfo&&clientInfo.phone || ''}}
                </Col>
              </Row>
              <Row v-if="clientInfo.id && public_people.length">
                <h4 style="font-size: 14px">
                  共有受卖人信息
                </h4>
              </Row>
              <Row style="padding: 0 30px" v-for="(item,index) in public_people" :key="index">
                <Col :span="8">
                  客户姓名：{{item.name}}
                </Col>
                <Col :span="8">
                  客户联系方式：{{item.phone}}
                </Col>
              </Row>
            </div>
          </FormItem>
        </Col>
      </Row>
      <!-- 优惠方式-->
      <FormItem>
        <h2>修改买受人</h2>
        <Row>
          <Col :span="3">
            <Select
                v-model="customerValue"
                filterable
                placeholder="输入客户名或手机号搜索"
                remote
                :remote-method="getCustomer"
                :loading="loadingCustomer">
                <Option v-for="(option, index) in customers" :value="option" :key="index + 'name'">{{option.value}}</Option>
            </Select>
          </Col>
          <Col :span="2">
            <div style="text-align: right">
              与主受买人关系：
            </div>
          </Col>
          <Col :span="4">
            <Select
                v-model="relation">
                <Option v-for="(option, index) in relations" :value="option" :key="index + 'name'">{{option}}</Option>
            </Select>
          </Col>
          <Col :span="2">
            <Button style="margin-left:20px" type="primary" @click="changeBuyer">确认</Button>
          </Col>
        </Row>
        <div class="house_info" style="margin-top: 20px">
          <Row v-for="(customer,index) in customerArr" :key="index">
            <Col :span="4">
              <div>
                客户姓名：{{customer.name}}
              </div>
            </Col>
            <Col :span="4">
              <div>
                联系方式：{{customer.phone}}
              </div>
            </Col>
            <Col :span="4">
              <div>
                与主受买人关系：{{customer.relation}}
              </div>
            </Col>
            <Col :span="4">
              <div>
                操作动作：{{customer.type}}
              </div>
            </Col>
            <Col :span="4">
              <div>
                <Button style="margin-left:20px" type="text" @click="deleteBuyer(index)">删除</Button>
              </div>
            </Col>
          </Row>
        </div>
      </FormItem>
      <!-- 操作动作-->
      <Row>
        <Col span="5">
          <FormItem label="操作动作：">
            <div>
              <Select
                  v-model="type">
                  <Option value="新增">新增</Option>
                  <Option value="删除">删除</Option>
              </Select>
            </div>
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
  import areaList from '@/components/config/district.js'

  export default {
    name: "clientCreate",
    data() {
      return {
        customer: '',
        relation: '配偶',
        relations: [
          "配偶",
          "子女",
          "父母",
          "其他",
          "亲戚",
          "同事",
        ],
        type: '',
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
        // 客户列表
        public_people: [],
        customers: [],
        customerArr: [],
        customerValue: '',
        loadingCustomer: false,
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
      changeBuyer() {
        if(this.customerValue) {
          let data = Object.assign({}, this.customerValue)
          data.relation = this.relation
          this.customerArr.push(data)
          this.customer = data
          this.customerValue = ""
        }
      },
      deleteBuyer(index) {
        this.customerArr.splice(index,1)
      },
      getCustomer(search) {
        this.loadingCustomer = true
        this.$post('change/customerCondition',{
          project_id: parseInt(this.$route.params.id),
          name_phone: search
        }).then(res => {
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          res.data.customer = res.data.customer.map((item) => {
            item.value = item.name + '|' + item.phone
            return item
          })
          this.customers = res.data.customer
          this.loadingCustomer = false
        })
      },
      goback() {
        this.$emit('cancelAdd')
      },
      /*
     *  获取到楼栋列表的基本配置
     * */
      getBuildingList(project_id) {
        this.$post('change/peopleChangeConfig', {project_id: project_id}).then(res => {
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
        this.$post('change/peopleChangeConfig', info).then(res => {
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
        this.$post('change/peopleChangeConfig', info).then(res => {
          if (res.status_code !== 200) return this.$Message.error('获取房源失败！')
          this.favorableFormInfo.house_id = null
          this.house = res.data.house
          this.clientInfo = {}
          this.houseInfo = {}
          // console.log('房源的基本信息===', this.house)
        }).catch(err => {
          this.$Message.error('获取房源失败！')
        })
      },
      /*
      *  获取到房源信息
      * */
      getHouseInfo(house_id) {
        var houseInfo = this.house.find(item => {
          return item.id === house_id
        })
        this.houseInfo = houseInfo
        if (houseInfo && houseInfo.only_people.length > 0) {
          let public_people = []
          houseInfo.only_people.forEach((item) => {
            if(item.is_main == 1) {
              this.clientInfo = item.customer
            }else {
              public_people.push(item.customer)
            }
          })
          this.public_people = public_people
        } else {
          this.clientInfo = {}
          this.public_people = []
        }
      },
      /*
      *  提交优惠单申请
      * */
      submitFavorable() {
        var info = this.favorableFormInfo
        if (!info.house_id) return this.$Message.error('请选择房源！')
        if (!this.customerArr || this.customerArr === 0) return this.$Message.error('共有受卖人不能为空！')
        let public_arr = this.customerArr.map ((item) => {
          return {
            relationship: item.relation,
            customer_id: item.id,
          }
        })
        var favorableFormInfo = {
          project_id: parseInt(this.$route.params.id),
          public_arr: public_arr,
          house_id: info.house_id,
          type: this.type,
          infos: info.desc
        }
        // console.log('提交的信息===', favorableFormInfo)
        this.$post('change/addPeopleChange',favorableFormInfo).then(res=>{
          // console.log('新建优惠单返回的结果===',res)
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          if(res.status_code!==200) return this.$Message.error('新建优惠单失败！')
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

  .project-container {
    padding: 20px 30px 50px;
    .ivu-btn-text {
      color: red;
    }
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
