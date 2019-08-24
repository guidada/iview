<template>
  <div v-if="isUploadXieYi" class="pic_box">
    <photosBox
      style="padding: 0 20px"
      :toSelect="true"
      :count="1"
      @canclePhotos="closePicBox"
      @addPhotos="addXieYiPhotos"
    ></photosBox>
  </div>
  <Form v-else class="ren_chou_form" ref="renChouForm" :model="renChouInfo" :rules="renChouRules" :label-width="135">
    <!--房源选择-->
    <Row>
      <Col span="11" style="min-width: 225px">
        <FormItem label="房源选择：">
          <Input
            :value="(editSalesInfo.house.building + '幢' + editSalesInfo.house.unit + '单元'+ editSalesInfo.house.room + '室')"
            disabled></Input>
        </FormItem>
      </Col>
    </Row>
    <!--销售活动-->
    <Row>
      <Col span="11">
        <FormItem label="销售活动：">
          <Select v-model="editSalesInfo.activity.id" placeholder="请选择活动" @on-change="getCurrentActive"
                  disabled>
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
          <!--<span>优惠方式：{{activeInfo.type}}</span>-->
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
                    @on-change="getClientInfo"
                    :disabled="currentStateNum>0 || globalReadOnly"
            >
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
          <th>认筹状态</th>
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
        <tr v-if="renChouClientList.length" v-for="item in renChouClientList" :key="item.id">
          <td>{{item.state}}</td>
          <td>{{item.name}}</td>
          <td>{{item.phone}}</td>
          <td>
            <InputNumber
              style="min-width: 100px;"
              :min="1"
              :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => `${value}`.replace(/￥\s?|(,*)/g, '')"
              :max="activeInfo.renchou_price"
              v-model="item.price"
              placeholder="请输入认筹金额"
              :disabled="currentStateNum>0 || globalReadOnly"
            ></InputNumber>
          </td>
          <td>
            <DatePicker
              style="min-width: 120px;"
              v-model="item.renchou_time"
              type="date"
              placeholder="请选择认筹时间"
              :disabled="currentStateNum>0 || globalReadOnly"
            ></DatePicker>
          </td>
          <td>
            <Select style="min-width: 120px;width: 135px;"
                    v-model="item.worker_id"
                    placeholder="请选择顾问"
                    :disabled="currentStateNum>0 || globalReadOnly"
            >
              <Option v-for="(item, index) in guwenList" :value="item.id" :key="index">{{item.name}}
              </Option>
            </Select>
          </td>
          <td style="display: flex;flex-direction: column;justify-content: center;width: 100%">
            <Button icon="ios-cloud-upload-outline"
                    @click="gotoUploadXieYi(item.customer_id)"
                    :disabled="currentStateNum>0 || globalReadOnly"
            >上传定金协议
            </Button>
            <a v-if="item.img" style="color: #348EED" target="_blank" :href="item.img">查看协议</a>
          </td>
          <td>
            <Icon
              class="delete_btn"
              type="ios-close-circle-outline"
              @click="deleteClient(item)"/>
          </td>
        </tr>
        <tr v-if="!renChouClientList.length">
          <td colspan="7">
            <div>暂无认筹数据</div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <!--提交认筹表单-->
    <div class="btn_wrap" v-if="currentStateNum===0 && !globalReadOnly">
      <Button type="primary" @click="submitModal=true">确定</Button>
      <Modal
        v-model="submitModal"
        title="请确认是否要提交该表单"
        @on-ok="submitRenChou"
        @on-cancel="cancelSubmit">
        <p style="color: red">注意：确认后部分内容不可更改！如您已确认无误，请点击右下角确认按钮提交表单！</p>
      </Modal>
      <Button style="margin-left: 30px" @click="goback">返回</Button>
    </div>
  </Form>
</template>

<script>
  import photosBox from '@/components/common/upLoadPhotosList/photosBox'

  export default {
    name: "renChouForm",
    components: {
      photosBox,
    },
    data() {
      return {
        submitModal: false,
        renChouInfo: {},
        renChouRules: {},
        // 活动列表
        activeList: [],
        // 活动信息,根据选中的活动动态获得，如未选中活动，则不显示
        activeInfo: {},
        // 认筹的客户列表
        renChouClientList: [],
        // 是否上传认筹协议
        isUploadXieYi: false,
        // 认筹客户的id
        renChouCustomerId: null,
        // 筛选到的要认筹的客户信息
        filterClientInfo: null,
				isrcdj:false,
      }
    },
    props: ['editSalesInfo', 'allClientList', 'guwenList','currentStateNum','globalReadOnly'],
    created() {
			this.getrcdj();
      this.activeInfo = this.editSalesInfo.activity
      var renChouClientList = this.editSalesInfo.renchou.row_number
      renChouClientList.forEach(item => {
        item.name = item.customer.name
        item.img = JSON.parse(item.img)
        item.phone = this.formatPhone(item.customer.phone)
      })
      this.renChouClientList = renChouClientList
      this.getActiveList()
    },
    methods: {
      goback() {
        this.$emit('goback')
      },
      /*
      *  获取到活动列表
      * */
      getActiveList() {
        this.$post('/follow/renchouConfig', {project_id: parseInt(this.$route.params.id)}).then(res => {
          if (res.status_code !== 200) return this.$Message.error('获取房源失败！')
          this.activeList = res.data.activity
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
        if (this.globalReadOnly) return this.$Message.error('不可编辑！')
        var filterClientInfo = this.filterClientInfo
        if (!this.activeInfo.id) return this.$Message.error('请选择销售活动！')
        if (!filterClientInfo.id) return this.$Message.error('请选择要认筹的客户！')
        filterClientInfo = {
          name: filterClientInfo.name,
          phone: this.formatPhone(filterClientInfo.phone),
          customer_id: filterClientInfo.id,
          price: null,
          renchou_time: null,
          worker_id: null,
          worker_name: null,
          img: ''
        }
        var hasSameClient = this.renChouClientList.some(item => {
          return item.customer_id === filterClientInfo.customer_id
        })
        if (hasSameClient) return this.$Message.error('当前客户已认筹！')
        this.renChouClientList.push(filterClientInfo)
      },
      /*
      *  删除认筹客户
      * */
      deleteClient(data) {
        if (this.currentStateNum>0 || this.globalReadOnly) return this.$Message.error('当前不可编辑该表单！')
        var renChouClientList = this.renChouClientList
        renChouClientList.forEach((item, index) => {
          if (item.customer_id === data.customer_id) {
            renChouClientList.splice(index, 1)
          }
        })
        this.renChouClientList = renChouClientList
      },
      /*
      * 去上传协议
      * */
      gotoUploadXieYi(id) {
        this.renChouCustomerId = id
        this.isUploadXieYi = true
      },
      /*
    * 格式化电话
    * */
      formatPhone(p) {
        return p.slice(0, 3) + '****' + p.slice(7, 11)
      },
      closePicBox() {
        this.isUploadXieYi = false
      },
      addXieYiPhotos(res) {
        var renChouClientList = this.renChouClientList
        renChouClientList.forEach(item => {
          if (item.customer_id === this.renChouCustomerId) {
            item.img = res
          }
        })
        this.renChouClientList = renChouClientList
        this.isUploadXieYi = false
      },
      /*
      *  提交认筹表单
      * */
      submitRenChou() {
        var renChouClientList = this.renChouClientList
        if (!renChouClientList.length) return this.$Message.error('请添加认筹客户！')
        var isEmpty = renChouClientList.some(item => {
					if(this.isrcdj){
						if(!item.img) return true;
					}
          return !item.price || !item.renchou_time || !item.worker_id 
        })
				
        if (isEmpty) return this.$Message.error('请完善认筹客户信息,上传协议！')
        var editSalesInfo = this.editSalesInfo
        var renChouInfo = {
          renchou_id: editSalesInfo.renchou.id,
          house_id: editSalesInfo.house.id,
          activity_id: editSalesInfo.activity.id,
          customer: renChouClientList
        }
        renChouInfo.customer.forEach(item => {
          var t = item.renchou_time
          item.renchou_time = this.formatTime(new Date(t))
        })
        this.$emit('submitRenChou',renChouInfo)
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
					// console.log(this.isrcdj)
				}).catch(err => {
				  this.$Message.error('获取配置失败！')
				})
			}
    }
  }
</script>

<style lang="less" scoped>
  .ren_chou_form {
    padding: 0;
    margin: 0;
  }
</style>
