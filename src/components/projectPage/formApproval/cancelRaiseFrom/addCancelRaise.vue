<template>
  <div class="project-container">
    <h2>发起解筹申请</h2>
    <Form :model="cancelRaiseFormInfo" ref="form" :label-width="135" :rules="formRules">
      <!-- 状态-->
      <Row>
        <Col span="10">
          <FormItem label="关联项目：">
            <div>{{projectInfo.name}}</div>
          </FormItem>
        </Col>
        <Col span="10" offset="1">
          <FormItem label="审批状态：">
            <div>{{isAddCancelRaise?'待新建':'审核中'}}</div>
          </FormItem>
        </Col>
      </Row>
      <!-- 关联房源-->
      <Row>
        <Col span="5" style="min-width: 225px">
          <FormItem label="房源选择：" prop="house_id">
            <Select v-model="cancelRaiseFormInfo.building" placeholder="楼栋" @on-change="getUnitList">
              <Option v-for="(item, index) in building" :value="item.id" :key="index">{{item.building_num}}幢</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="3" style="min-width: 100px">
          <FormItem :label-width="1">
            <Select v-model="cancelRaiseFormInfo.unit" placeholder="单元" @on-change="getHouseList">
              <Option v-for="(item, index) in unit" :value="item.id" :key="index">{{item.unit_num}}单元</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="3" style="min-width: 100px">
          <FormItem :label-width="1">
            <Select v-model="cancelRaiseFormInfo.house_id" placeholder="房源" @on-change="getHouseInfo">
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
              <div v-if="clientInfo.id">
                <Row style="padding: 0 30px">
                  <Col :span="8">
                    房源状态：<span style="color: #348EED">{{clientInfo.state}}</span>
                  </Col>
                </Row>
                <Row>
                  <h4 style="font-size: 14px">
                    客户信息
                  </h4>
                </Row>
                <Row style="padding: 0 15px">
                  <Checkbox-group v-model="selectedCustomers" @on-change="selectJiechouItem">
                    <Row v-for="(item,index) in clientList" :key="index">
                      <Col :span="8">
                        <Checkbox :label="item.id+ '-' +item.customer_id">
                          <span>客户姓名：{{item.customer.name}}</span>
                        </Checkbox>
                      </Col>
                      <Col :span="8">
                        联系方式：{{item.customer.phone}}
                      </Col>
                    </Row>
                  </Checkbox-group>
                </Row>
              </div>
              <Row v-else style="padding: 0 30px;">
                <div>温馨提示：当前未选择房源(或)当前房源状态未处于 <span style="color: red">认筹中</span> 状态,无法发起解筹申请</div>
              </Row>
            </div>
          </FormItem>
        </Col>
      </Row>
      <!-- 备注-->
      <Row>
        <Col span="10">
          <FormItem label="备注原因：">
            <div>
              <Input type="textarea" v-model="cancelRaiseFormInfo.desc" placeholder="请输入解筹原因"></Input>
            </div>
          </FormItem>
        </Col>
      </Row>
      <!-- 提交按钮-->
      <div class="btn_wrap">
        <Button type="primary" @click="submitCancelRaise">保存</Button>
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
        //房源的所有客户信息
        clientList: [],

        //选中的解筹客户id数组
        selectedCustomers: [],
        // 处理后的解筹客户数组信息
        selectedList: [],
        cancelRaiseFormInfo: {
          project_id: this.$route.params.id,
          name: '',
          desc: '',
          building: null,
          unit: null,
          house_id: null,
        },
        formRules: {
          house_id: [{required: true, type: 'number', message: '房源不能为空', trigger: 'blur'}],
        },
      }
    },
    props: ['projectInfo', 'isAddCancelRaise'],
    created() {
      this.getBuildingList(parseInt(this.$route.params.id))
    },
    methods: {
      /*
      * 选择需要的解筹的客户对象
      * */
      selectJiechouItem(vals) {
        var list = []
        vals.forEach(item => {
          var arr = item.split('-')
          list.push({
            row_number_id: parseInt(arr[0]),
            customer_id: parseInt(arr[1])
          })
        })
        this.selectedList = list
      },
      goback() {
        this.$emit('cancelAdd')
      },
      /*
     *  获取到解筹的基本配置
     * */
      getBuildingList(project_id) {
        this.$post('jiechou/jiechouConfig', {project_id: project_id}).then(res => {
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
        this.$post('jiechou/jiechouConfig', info).then(res => {
          if (res.status_code !== 200) return this.$Message.error('获取房源失败！')
          this.cancelRaiseFormInfo.unit = ''
          this.cancelRaiseFormInfo.house_id = null
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
        if (unit_id != null) {
          this.$post('jiechou/jiechouConfig', info).then(res => {
            if (res.status_code !== 200) return this.$Message.error('获取房源失败！')
            this.cancelRaiseFormInfo.house_id = null
            this.house = res.data.house
            this.clientInfo = {}
            this.houseInfo = {}
          }).catch(err => {
            this.$Message.error('获取房源失败！')
          })
        }
      },
      /*
      *  获取到房源信息
      * */
      getHouseInfo(house_id) {
        var houseInfo = this.house.find(item => {
          return item.id === house_id
        })
        this.houseInfo = houseInfo
        if (houseInfo && houseInfo.follow_history.length > 0) {
          this.clientInfo = houseInfo.follow_history[0]
          this.clientList = houseInfo.follow_history[0].renchou.row_number
        } else {
          this.clientInfo = {}
          this.clientList = []
        }
      },
      /*
      *  提交优惠单申请
      * */
      submitCancelRaise() {
        var info = this.cancelRaiseFormInfo
        if (!info.house_id) return this.$Message.error('请选择房源！')
        if (!this.selectedList.length) return this.$Message.error('请选择解筹客户！')
        var cancelRaiseFormInfo = {
          project_id: parseInt(this.$route.params.id),
          house_id: info.house_id,
          jiechou_arr: this.selectedList,
          infos: info.desc
        }
        // console.log('提交的信息===', cancelRaiseFormInfo)
         this.$post('/jiechou/addJiechou', cancelRaiseFormInfo).then(res => {
           if (res.data === '没有权限') {
             this.$Modal.error({
               title: '警告',
               content: '没有权限'
             })
             return false
           }
           if (res.status_code !== 200) return this.$Message.error('发起解筹申请失败！')
           if  (res.data ==='该房源已经解筹或解筹审核中') return this.$Message.error('该房源已经解筹或解筹审核中')
           this.$Message.success('发起解筹申请成功！')
           this.$emit('addSuccess')
         }).catch(err => {
           this.$Message.error('发起解筹申请失败！')
           console.log(err)
         })
      },
    }
  }
</script>

<style lang="less" scoped>

  .project-container {
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

    .approve_process_wrap {
      h3 {
        font-size: 18px;
        line-height: 60px;
        border-bottom: 1px solid #aaaaaa;
        margin-bottom: 20px;
      }
    }
  }

</style>
