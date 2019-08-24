<template>
  <!--照片盒子，添加协议时使用，一次只能添加一张图片-->
  <div v-if="isUploadXieYi" class="pic_box">
    <photosBox
      style="padding: 0 20px"
      :toSelect="true"
      :count="1"
      @canclePhotos="closePicBox"
      @addPhotos="addPhotos"
    ></photosBox>
  </div>
  <div v-else class="add_form_container">
    <h2><span>新建销控单</span></h2>
    <Form class="form" ref="salesForm" :model="salesInfo" :rules="salesRules" :label-width="130">
      <!--关联项目-->
      <Row>
        <Col span="11">
          <FormItem label="关联项目：">
            <div class="text">{{salesInfo.project_name}}</div>
          </FormItem>
        </Col>
        <Col span="11" offset="2">
          <FormItem label="销售状态：">
            <Input value="认筹" disabled></Input>
          </FormItem>
        </Col>
      </Row>
      <!-- 房源选择 三级下拉选择框-->
      <Row>
        <Col span="5" style="min-width: 225px">
          <FormItem label="房源选择：" prop="house_id">
            <Select v-model="salesInfo.building" placeholder="楼栋" @on-change="getUnitList">
              <Option v-for="(item, index) in building" :value="item.id" :key="index">{{item.building_num}}幢</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="3" style="min-width: 100px">
          <FormItem :label-width="1">
            <Select v-model="salesInfo.unit" placeholder="单元" @on-change="getHouseList">
              <Option v-for="(item, index) in unit" :value="item.id" :key="index">{{item.unit_num}}单元</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="3" style="min-width: 100px">
          <FormItem :label-width="1">
            <Select v-model="salesInfo.house_id" placeholder="房源">
              <Option v-for="(item, index) in house" :value="item.id" :key="index">{{item.room}}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <!--销售活动-->
      <Row>
        <Col span="11">
          <FormItem label="销售活动：">
            <Select v-model="salesInfo.activity_id" placeholder="请选择活动" @on-change="getCurrentActive">
              <Option
                v-for="(item, index) in activeList"
                :value="item.id"
                :key="index"
              >{{item.name}}
              </Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <div class="active_info_wrap">
          <h3>活动数据：</h3>
          <div class="active_content" v-if="activeInfo.id">
            <span>活动起止时间：{{activeInfo.start_time}} ~ {{activeInfo.end_time}}</span>
            <span>类型：{{activeInfo.leixing}}</span>
            <span>认购金额：{{activeInfo.subscribe_price}}</span>
            <div v-if="activeInfo.type==='先折后减'">优惠方式：{{activeInfo.type}}
              <span style="color: #348EED;margin-left: 15px">{{activeInfo.discount}}折后--减{{activeInfo.reduce}}元</span>
            </div>
            <div v-else>优惠方式：{{activeInfo.type}}
              <span style="color: #348EED;margin-left: 15px">减{{activeInfo.reduce}}元后--{{activeInfo.discount}}折</span>
            </div>
          </div>
          <div class="active_content" v-else>
            暂未选择活动
          </div>
        </div>
      </Row>
      <!--客户信息-->
      <Row>
        <Col span="11">
          <FormItem label="客户信息：">
            <div style="display: flex;">
              <Select filterable placeholder="请输入客户姓名/手机号"
                      @on-change="getClientInfo">
                <Option v-for="item in allClientList" :value="item.id" :key="item.id">{{ item.name + '/' +
                  item.phone}}
                </Option>
              </Select>
            </div>
          </FormItem>
        </Col>
        <Icon type="ios-add-circle-outline" class="add_client_btn" @click="addClient"/>
      </Row>
      <!--客户列表-->
      <div class="client_list_wrap">
        <table class="table_wrap" cellspacing="0">
          <thead>
          <tr>
            <th>客户姓名</th>
            <th>联系方式</th>
            <th>认筹金额(元)</th>
            <th>认筹日期</th>
            <th>归属置业顾问</th>
            <th>上传定金协议</th>
            <th>删除</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="clientList.length" v-for="item in clientList" :key="item.id">
            <td>{{item.name}}</td>
            <td>{{item.phone}}</td>
            <td>
              <InputNumber
                style="min-width: 100px;"
                :min="1"
                :max="activeInfo.renchou_price"
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => `${value}`.replace(/￥\s?|(,*)/g, '')"
                v-model="item.price"
                placeholder="请输入认筹金额"
              ></InputNumber>
            </td>
            <td>
              <DatePicker
                style="min-width: 120px;"
                v-model="item.renchou_time" type="date"
                placeholder="请选择认筹时间"
              ></DatePicker>
            </td>
            <td>
              <Select style="min-width: 120px;width: 135px;" v-model="item.worker_id" placeholder="请选择顾问">
                <Option v-for="(item, index) in guwenList" :value="item.id" :key="index">{{item.name}}</Option>
              </Select>
            </td>
            <td>
              <!--<Upload action="//jsonplaceholder.typicode.com/posts/">
                <Button icon="ios-cloud-upload-outline">上传定金协议</Button>
              </Upload>-->
              <Button icon="ios-cloud-upload-outline" @click="gotoUploadXieYi(item.customer_id)">上传定金协议</Button>
              <a v-if="item.img" style="color: #348EED" target="_blank" :href="item.img">查看协议</a>
            </td>
            <td>
              <Icon
                class="delete_btn"
                type="ios-close-circle-outline"
                @click="deleteClient(item)"/>
            </td>
          </tr>
          <tr v-if="!clientList.length">
            <td colspan="7">
              <div>暂无认筹数据</div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <!--提交按钮-->
      <div class="btn_wrap">
        <Button type="primary" @click="btnSubmit('salesForm')">确认</Button>
        <Button style="margin-left: 30px" @click="goback">返回</Button>
      </div>
    </Form>
  </div>
</template>

<script>
  import photosBox from '@/components/common/upLoadPhotosList/photosBox'

  export default {
    components: {
      photosBox,
    },
    data() {
      return {
        // 销控单基本信息
        salesInfo: {
          project_name: '',
          project_id: '',
          building: '',
          unit: '',
          house_id: '',
          activity_id: null,
          customer: []
        },
        // 销控单验证规则
        salesRules: {
          house_id: [
            {
              required: true,
              type:'number',
              message: '房源不能为空',
              trigger: 'blur'
            }
          ],
        },
        // 楼栋选择列表
        building: [],
        // 单元选择列表
        unit: [],
        // 房源选择列表
        house: [],
        // 销售活动列表
        activeList: [],
        // 活动信息,根据选中的活动动态获得，如未选中活动，则不显示
        activeInfo: {},
        // 销控单认筹客户列表
        clientList: [],
        // 所有的客户列表
        allClientList: [],
        // 顾问列表
        guwenList: [],
        // 要筛选的客户信息
        filterClientInfo: {},
        // 当前选中的楼栋id
        building_id: null,
        // 是否要上传协议
        isUploadXieYi: false,
        // 上传协议时指定的认筹客户id
        customerId: null,
				//上传协议是否必填
				isrcdj:false
      }
    },
    props: ['projectInfo'],
    created() {
			this.getrcdj();
      this.salesInfo.project_name = this.projectInfo.name
      this.salesInfo.project_id = this.projectInfo.id

      this.getBaseConfig(this.$route.params.id)
      this.getCustomerAndGuWen(this.$route.params.id)
    },
    methods: {
      goback() {
        this.$emit('cancelAdd')
      },
      /*
      *  提交新建表单
      * */
      btnSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (!valid) return this.$Message.error('请完善信息~')
          var clientList = this.clientList
          if (!clientList.length) return this.$Message.error('请添加认筹客户！')
          var isEmpty = clientList.some(item => {
						if(this.isrcdj){
							if(!item.img) return true;
						}
            return !item.price || !item.renchou_time || !item.worker_id 
          })
					
          if (isEmpty) return this.$Message.error('请完善认筹客户信息,上传协议！')
          var salesInfo = this.salesInfo
          salesInfo.customer = this.clientList
          salesInfo.customer.forEach(item => {
            var t = item.renchou_time
            item.renchou_time = this.formatTime(new Date(t))
          })
          // console.log('要提交的数据', salesInfo)
          this.$post('/follow/createRenchou',salesInfo).then(res=>{
            if (res.data === '没有权限') {
              this.$Modal.error({
                title: '警告',
                content: '没有权限'
              })
              return false
            }
            if (res.status_code !== 200) return this.$Message.error('新建销控单失败！')
            if (res.data === '该房源已在销售中') return this.$Message.error('该房源已在销售中！')
            this.$Message.success('新建销控单成功！')
            this.$emit('addSuccess')
          }).catch(err=>{
            this.$Message.error('新建销控单失败！')
            console.log(err)
          })
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
      /*
      *  获取到选定的客户信息
      * */
      getClientInfo(id) {
        this.filterClientInfo = this.allClientList.find(item => {
          return item.id === id
        })
      },
      /*
      *  添加认筹客户
      * */
      addClient() {
        var filterClientInfo = this.filterClientInfo
        // console.log('filterClientInfo',filterClientInfo)
        if (!this.activeInfo.id) return this.$Message.error('请选择销售活动！')
        if (!filterClientInfo.id) return this.$Message.error('请选择要认筹的客户！')
        filterClientInfo = {
          name: filterClientInfo.name,
          phone: filterClientInfo.phone.slice(0, 3) + '****' + filterClientInfo.phone.slice(7, 11),
          customer_id: filterClientInfo.id,
          price: null,
          renchou_time: null,
          worker_id: null,
          worker_name: null,
          img: ''
        }
        var hasSameClient = this.clientList.some(item => {
          return item.customer_id === filterClientInfo.customer_id
        })
        if (hasSameClient) return this.$Message.error('当前客户已认筹！')
        this.clientList.push(filterClientInfo)
        // console.log('已加入认筹的客户', this.clientList)
      },
      /*
      *  删除认筹客户
      * */
      deleteClient(data) {
        var clientList = this.clientList
        clientList.forEach((item, index) => {
          if (item.customer_id === data.customer_id) {
            clientList.splice(index, 1)
          }
        })
        this.clientList = clientList
      },
      /*
      *  获取到认筹的基本配置
      * */
      getBaseConfig(project_id) {
        this.$post('/follow/renchouConfig', {project_id: project_id}).then(res => {
          if (res.status_code !== 200) return this.$Message.error('获取房源失败！')
          this.activeList = res.data.activity
          this.building = res.data.building
        }).catch(err => {
          this.$Message.error('获取房源失败！')
        })
      },
      /*
      *  获取到当前选择的活动信息
      * */
      getCurrentActive(id) {
        this.activeInfo = this.activeList.find(item => {
          return item.id === id
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
        this.$post('/follow/renchouConfig', info).then(res => {
          if (res.status_code !== 200) return this.$Message.error('获取房源失败！')
          this.salesInfo.unit = ''
          this.salesInfo.house_id = null
          this.unit = res.data.unit
        }).catch(err => {
          this.$Message.error('获取房源失败！')
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
        this.$post('/follow/renchouConfig', info).then(res => {
          if (res.status_code !== 200) return this.$Message.error('获取房源失败！')
          this.salesInfo.house_id = null
          this.house = res.data.house
        }).catch(err => {
          this.$Message.error('获取房源失败！')
        })
      },
      /*
      * 获取到客户列表和置业顾问列表
      * */
      getCustomerAndGuWen(id) {
        this.$post('/follow/customerCondition', {project_id: id}).then(res => {
          if (res.status_code !== 200) return this.$Message.error('获取顾问失败！')
          this.guwenList = res.data.zygw
          this.allClientList = res.data.customer
        }).catch(err => {
          this.$Message.error('获取顾问失败！')
        })
      },
      /*
      *  去上传协议
      * */
      gotoUploadXieYi(id) {
        this.customerId = id
        this.isUploadXieYi = true
      },
      /*
      * 取消上传协议
      * */
      closePicBox() {
        this.isUploadXieYi = false
      },
      /*
      *  把协议图片添加到认筹客户信息中
      * */
      addPhotos(res) {
        var clientList = this.clientList
        clientList.forEach(item => {
          if (item.customer_id === this.customerId) {
            item.img = res
          }
        })
        this.clientList = clientList
        this.isUploadXieYi = false
      },
			/* 
			* 获取认筹定金配置
			*  */
			getrcdj(){
				this.$post('/config/projectConfigSj',{
					project_id:parseInt(this.$route.params.id)
				}).then(res => {
				  // if (res.status_code !== 200) return this.$Message.error('获取配置失败！')
				  // console.log(res)
					if(res.config.subscribe_xy === 1){
						this.isrcdj = true;
					}
					console.log(this.isrcdj)
				}).catch(err => {
				  this.$Message.error('获取配置失败！')
				})
			}
    }
  }
</script>

<style lang="less">
  .add_form_container {
    padding: 30px;

    h2 {
      background-color: #F2F2F2;
      color: #ffffff;
      padding: 20px 0;
      margin-bottom: 30px;

      span {
        background-color: #85C1F8;
        padding: 20px;
      }
    }

    .ivu-form .ivu-form-item-label {
      font-size: 14px;
    }

    .text {
      font-size: 14px;
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
          max-width: 200px;

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

    .btn_wrap {
      display: flex;
      justify-content: center;
      margin-top: 30px;
    }
  }
</style>
