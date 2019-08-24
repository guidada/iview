<template>
  <!--配置职级价格-->
  <Card v-if="isConfigPrice" style="height: 100%">
    <configPrice
      @cancelConfigPrice="cancelConfigPrice"
      :houseInfo="housePrice"
      @configPriceSuccess="configPriceSuccess"
    ></configPrice>
  </Card>
  <!--回款记录-->
  <Card v-else-if="isEditDiPrice" style="height: 100%">
    <d_price
      ref="diPriceForm"
      @cancelDiPrice="cancelDiPrice"
      @submitDiPriceSuccess="submitDiPriceSuccess"
      :houseInfo="dprice"
    ></d_price>
  </Card>
  <!-- 主体-->
  <Form v-else class="form" ref="houseForm" :model="houseInfo" :rules="houseRules" :label-width="100">
    <Row>
      <Col>
        <FormItem label="房源锁定：" prop="state">
          <RadioGroup v-model="houseInfo.state" type="button">
            <Radio :disabled="isForbid" label="待售"></Radio>
            <Radio :disabled="isForbid" label="在售"></Radio>
            <Radio :disabled="isForbid" label="内部锁定"></Radio>
            <Radio :disabled="isForbid" label="他售"></Radio>
            <Radio :disabled="isForbid" label="规外"></Radio>
          </RadioGroup>
          <span style="color: #aaaaaa;margin-left: 30px">{{houseInfo.state}}</span>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="7">
        <FormItem label="所在楼栋：" prop="building">
          <div style="display: flex;justify-content: flex-start">
            <Input v-model="houseInfo.building" disabled></Input>
            <span style="line-height: 30px;margin-left: 9px">幢</span>
          </div>
        </FormItem>
      </Col>
      <Col span="7" offset="1">
        <FormItem label="所在单元：" prop="unit">
          <div style="display: flex;justify-content: flex-start">
            <!--<Input v-model="houseInfo.unit"></Input>-->
            <Select v-model="houseInfo.unit" style="width:200px" @on-change="checkUnit">
              <Option v-for="item in unitList" :value="item.unit_num" :key="item.unit_num">{{ item.unit_num }}</Option>
            </Select>
            <span style="line-height: 30px;margin-left: 9px;width: 40px">单元</span>
          </div>
        </FormItem>
      </Col>
      <Col span="7" offset="1">
        <FormItem label="所在楼层：" prop="in_floor">
          <div style="display: flex;justify-content: flex-start">
            <InputNumber
              style="width: 100%"
              :min="1"
              :max="maxFloor"
              v-model="houseInfo.in_floor"
              @on-change="checkFloor"
              placeholder="请输入楼层"
            ></InputNumber>
            <span style="line-height: 30px;margin-left: 9px;width: 40px">层</span>
          </div>
        </FormItem>
      </Col>
    </Row>
    <Row style="border-bottom: 1px dashed #aaaaaa;margin-bottom: 20px">
      <Col span="9">
        <FormItem label="房源：" prop="room">
          <!--<Input v-model="houseInfo.room" placeholder="请输入房源号"></Input>-->
          <Select v-model="houseInfo.room" style="width:200px">
            <Option v-for="item in houseNumList" :value="item" :key="item">{{ item }}</Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="5" offset="1" style="line-height: 30px">
        <!--<div style="color: #aaaaaa">提示：房源格式为101，302，1202</div>-->
        <div style="color: #aaaaaa">提示：请先选择单元和楼层</div>
      </Col>
      <Col span="7">
        <FormItem label="房源别名：">
          <Input v-model="houseInfo.nickname" placeholder="请输入房源别名"></Input>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="8">
        <FormItem label="户型：" prop="project_huxing_id">
          <Select v-model="houseInfo.project_huxing_id" style="width:200px">
            <Option v-for="item in houseTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="6" offset="1" style="line-height: 30px">
        <span>户型从户型库中获取，优先上传户型库。</span>
      </Col>
      <Col span="6" offset="1" style="line-height: 30px">
        <span style="color: #348EED;cursor: pointer" @click="gotoUploadHuXing">上传户型库</span>
      </Col>
    </Row>
    <Row>
      <Col span="6">
        <FormItem label="建筑面积：" prop="mianji">
          <div style="display: flex;justify-content: flex-start">
            <InputNumber
              style="width: 100%"
              :min="1"
              v-model="houseInfo.mianji"
              placeholder="请输入面积"></InputNumber>
            <span style="line-height: 30px;margin-left: 9px">㎡</span>
          </div>
        </FormItem>
      </Col>
      <Col span="6">
        <FormItem label="赠送约：" prop="give_mianji">
          <div style="display: flex;justify-content: flex-start">
            <InputNumber
              style="width: 100%"
              :min="1"
              v-model="houseInfo.give_mianji"
              placeholder="请输入面积"></InputNumber>
            <span style="line-height: 30px;margin-left: 9px">㎡</span>
          </div>
        </FormItem>
      </Col>
      <Col span="6">
        <FormItem label="公摊：" prop="public_mianji">
          <div style="display: flex;justify-content: flex-start">
            <InputNumber
              style="width: 100%"
              :min="1"
              v-model="houseInfo.public_mianji"
              placeholder="请输入面积"></InputNumber>
            <span style="line-height: 30px;margin-left: 9px">㎡</span>
          </div>
        </FormItem>
      </Col>
      <Col span="6">
        <FormItem label="实测面积：" prop="true_mianji">
          <div style="display: flex;justify-content: flex-start">
            <InputNumber
              style="width: 100%"
              :min="1"
              v-model="houseInfo.true_mianji"
              placeholder="请输入面积"></InputNumber>
            <span style="line-height: 30px;margin-left: 9px">㎡</span>
          </div>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col>
        <FormItem label="房屋朝向：" prop="house_toward">
          <Select v-model="houseInfo.house_toward" style="width:200px">
            <Option v-for="item in fangXiangList" :value="item" :key="item">{{ item }}</Option>
          </Select>
        </FormItem>
      </Col>
    </Row>
    <Row style="border-bottom: 1px dashed #aaaaaa;margin-bottom: 20px">
      <Col>
        <FormItem label="物业类型：" prop="property_type">
          <RadioGroup v-model="houseInfo.property_type">
            <Radio
              v-for="(item,index) in config_house_type"
              :key="index"
              :label="item"></Radio>
          </RadioGroup>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="9">
        <FormItem label="表单价：" prop="b_price">
          <div style="display: flex;justify-content: flex-start">
            <InputNumber
              style="width: 100%"
              :min="1"
              :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => `${value}`.replace(/￥\s?|(,*)/g, '')"
              v-model="houseInfo.b_price"
              placeholder="请输入金额"></InputNumber>
            <span style="line-height: 30px;margin-left: 9px;width: 50px">元/㎡</span>
          </div>
        </FormItem>
      </Col>
      <Col span="9">
        <FormItem label="表总价：" prop="b_total_price">
          <div style="display: flex;justify-content: flex-start">
            <InputNumber
              style="width: 100%"
              :min="1"
              :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => `${value}`.replace(/￥\s?|(,*)/g, '')"
              v-model="houseInfo.b_total_price"
              placeholder="请输入金额"></InputNumber>
            <span style="line-height: 30px;margin-left: 9px">元</span>
          </div>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="4" offset="1">
        <span style="color: #348EED;cursor: pointer;;line-height: 30px" @click="gotoDiPrice">配置底价</span>
      </Col>
      <Col span="4" offset="1" >
        <span style="color: #348EED;cursor: pointer;;line-height: 30px" @click="gotoConfigPrice">配置职级表价</span>
      </Col>
    </Row>
    <!--提交按钮-->
    <div style="display: flex;justify-content: center">
      <Button type="info" @click="submitForm('houseForm')" >确认</Button>
      <Button style="margin-left: 20px;" @click="cancelEditHouse">返回</Button>
    </div>
  </Form>
</template>

<script>
  import configPrice from './configPrice'
  import d_price from './d_price'

  export default {
    name: "baseForm",
    components: {
      configPrice,
      d_price,
    },
    data() {
      return {
				housePrice:{},
				dprice:{},
	
        houseInfo: {
          // 项目id
          project_id: this.$route.params.id,
          // 户型id
          project_huxing_id: 4,
          // 楼栋号
          building: null,
          // 单元号
          unit: null,
          // 房源号
          room: null,
          // 别名
          nickname: '',
          // 朝向
          house_toward: '西',
          // 物业类型
          property_type: '住宅',
          // 表单价
          b_price: null,
          // 表总价
          b_total_price: null,
          // 底单价
          d_price: null,
          // 底总价
          d_total_price: null,
          // 建筑面积
          mianji: null,
          // 实测面积
          true_mianji: null,
          // 赠送面积
          give_mianji: null,
          // 公摊面积
          public_mianji: null,
          // 房源状态
          state: '待售',
          // 房源锁定
          // state: '待售',
          // 所在楼层
          in_floor: null,
        },
        houseRules: {
          state: [{
            required: true,
            message: '房源锁定状态不能为空！',
            trigger: 'blur'
          }],
          building: [{
            required: true,
            type: 'number',
            message: '楼栋号不能为空！',
            trigger: 'blur'
          }],
          unit: [{
            required: true,
            type: 'number',
            message: '单元号不能为空！',
            trigger: 'blur'
          }],
          in_floor: [{
            required: true,
            type: 'number',
            message: '楼层不能为空！',
            trigger: 'blur'
          }],
          room: [{
            required: true,
            type: 'number',
            message: '房源号不能为空！',
            trigger: 'blur'
          }],
          project_huxing_id: [{
            required: true,
            type: 'number',
            message: '户型不能为空！',
            trigger: 'blur'
          }],
          house_toward: [{
            required: true,
            message: '朝向不能为空！',
            trigger: 'blur'
          }],
          property_type: [{
            required: true,
            message: '物业类型不能为空！',
            trigger: 'blur'
          }],
          mianji: [{
            required: true,
            type: 'number',
            message: '建筑面积不能为空！',
            trigger: 'blur'
          }],
          true_mianji: [{
            // required: true,
            type: 'number',
            message: '实测面积不能为空！',
            trigger: 'blur'
          }],
          give_mianji: [{
            // required: true,
            type: 'number',
            message: '赠送面积不能为空！',
            trigger: 'blur'
          }],
          public_mianji: [{
            required: true,
            type: 'number',
            message: '公摊面积不能为空！',
            trigger: 'blur'
          }],
          b_price: [{
            // required: true,
            type: 'number',
            message: '表单价不能为空！',
            trigger: 'blur'
          }],
          b_total_price: [{
            // required: true,
            type: 'number',
            message: '表总价不能为空！',
            trigger: 'blur'
          }],
          d_price: [{
            // required: true,
            type: 'number',
            message: '底单价不能为空！',
            trigger: 'blur'
          }],
          d_total_price: [{
            // required: true,
            type: 'number',
            message: '底总价不能为空！',
            trigger: 'blur'
          }],
        },
        // 户型列表
        houseTypeList: [],
        // 单元列表
        unitList: [],
        // 楼栋方向
        fangXiangList: ['东', '南', '西', '北'],
        // 物业类型
        config_house_type: ['住宅', '商铺'],
        // 是否配置资金表
        isConfigPrice: false,
        // 允许的最高楼层
        maxFloor: 1,
        // 每层最大尾号
        maxDoorNum: 1,
        // 指定楼层的房号
        houseNumList: ['请先选择单元和楼层'],
        // 是否去配置底价
        isEditDiPrice: false,
				isMain:false
				
      }
    },
    props: ['currentBuildingInfo', 'editHouseInfo', 'isForbid'],
    created() {
			// console.log('1')
      console.log('没有处理前要编辑的房源信息====', this.editHouseInfo)
      this.getHouseConfig()
      // console.log('currentBuildingInfo============', this.currentBuildingInfo)
			// this.findEidtHouseInfo();
      this.unitList = this.currentBuildingInfo.unit
			
			console.log('ididididid', this.editHouseInfo)
			this.findDPrice()
			this.findHousePrice()
      if (this.editHouseInfo.id) {
        console.log('this.editHousdwdwdw=', 1111)
        this.houseInfo = {
          id: this.editHouseInfo.id,
          project_id: this.editHouseInfo.project_id,
          project_huxing_id: this.editHouseInfo.project_huxing_id,
          building: this.editHouseInfo.building,
          unit: parseInt(this.editHouseInfo.unit),
          room: parseInt(this.editHouseInfo.room),
          nickname: this.editHouseInfo.nickname,
          house_toward: this.editHouseInfo.house_toward,
          property_type: this.editHouseInfo.property_type,
          b_price: this.editHouseInfo.b_price || null,
          b_total_price: this.editHouseInfo.b_total_price || null,
          d_price: this.editHouseInfo.d_price || null,
          d_total_price: this.editHouseInfo.d_total_price || null,
          mianji: parseFloat(this.editHouseInfo.mianji) || null,
          true_mianji: parseFloat(this.editHouseInfo.true_mianji) || null,
          give_mianji: parseFloat(this.editHouseInfo.give_mianji) || null,
          public_mianji: parseFloat(this.editHouseInfo.public_mianji) || null,
          state: this.editHouseInfo.state,
          in_floor: parseInt(this.editHouseInfo.in_floor),
        }
				console.log('this.houseInfo==', this.houseInfo)
        this.checkUnit(this.editHouseInfo.unit)
        this.checkFloor(this.editHouseInfo.in_floor)
				// c = true

      }
			console.log('this.editHouseInfo==', this.editHouseInfo)
      this.houseInfo.building = this.currentBuildingInfo.building_num
			

    },
    methods: {
      /*
      * 一些基本配置，如方向，户型，房子类型等
      * */
      getHouseConfig() {
        this.$post('/house/houseConfig', {project_id: this.$route.params.id}).then(res => {
          if (res.status_code !== 200) return this.$Message.error('获取房源配置失败！')
          this.houseTypeList = res.data.huxing
          this.fangXiangList = res.data.config_HouseToward
          this.config_house_type = res.data.config_house_type
        }).catch(err => {
          this.$Message.error('获取房源配置失败！')
        })
      },
      /*
      * 取消编辑房源
      * */
      cancelEditHouse() {
        this.$emit('cancelEditHouse')
      },
      /*
      * 跳转到添加户型页面
      * */
      gotoUploadHuXing() {
        this.$router.push({
          name: 'houseType'
        })
      },
      /*
      * 跳转到资金配置页面
      * */
      gotoConfigPrice() {
        this.isConfigPrice = true
      },
      /*
      * 取消配置资金
      * */
      cancelConfigPrice() {
        this.isConfigPrice = false
        this.$Message.error('取消配置职级表价')
      },
      /*
      * 去配置底价
      * */
      gotoDiPrice() {
        this.isEditDiPrice = true
      },
      /*
      * 取消
      * */
      cancelDiPrice() {
        this.isEditDiPrice = false
        this.$Message.error('取消配置底价')
      },
      /*
      * 配置低单价提交表单
      * */
      submitDiPriceSuccess(res) {
        this.houseInfo.d_price = res.d_price
        this.houseInfo.d_total_price = res.d_total_price
        this.isEditDiPrice = false
      },
      /*
      * 提交新增、编辑表单
      * */
      submitForm(name) {
        this.$refs[name].validate((valid) => { // 编辑的情况
          if (!valid) return this.$Message.error('请完善信息~')
          if (this.editHouseInfo.id) {
            this.$post('/house/updateHouse', this.houseInfo).then(res => {
              // console.log(res)
              if (res.status_code !== 200) return this.$Message.error('编辑房源失败！')
              if (res.data === '请完善信息') return this.$Message.error('请完善信息！')
              this.$Message.success('编辑房源成功！')
              setTimeout(() => {
                location.reload()
              }, 500)
              // console.log(res)
              this.$emit('cancelEditHouse')
            }).catch(err => {
              this.$Message.error('编辑房源失败！')
            })
          } else { // 新增的情况
            this.$post('/house/addHouse', this.houseInfo).then(res => {
              if (res.status_code !== 200) return this.$Message.error('添加房源失败！')
              if (res.data === '添加的房源已存在') return this.$Message.error('添加的房源已存在！')
              if (res.data === '请完善信息') return this.$Message.error('请完善信息！')
              this.$Message.success('添加房源成功！')
              // console.log('添加成功的结果===', res.data)
              setTimeout(() => {
                location.reload()
              }, 500)
              this.$emit('cancelEditHouse')
            }).catch(err => {
              this.$Message.error('添加房源失败！')
              console.log(err)
            })
          }
        })
      },
      /*
      * 切换单元的时候监听楼层高度
      * */
      checkUnit(i) {
        var list = this.unitList
        list.forEach(item => {
          if (item.unit_num === i) {
            this.maxFloor = item.floor_count
            this.maxDoorNum = item.door
          }
        })
        this.houseInfo.in_floor = this.houseInfo.in_floor ? this.houseInfo.in_floor : 1
        this.checkFloor(this.houseInfo.in_floor)
      },
      /*
      * 切换楼层的时候，动态确定当前楼层的户数
      * */
      checkFloor(floor) {
        var list = []
        for (var i = 1; i <= this.maxDoorNum; i++) {
          list.push(parseInt(floor + '0' + i))
        }
        // console.log('选择的楼层', list)
        this.houseNumList = list
      },
      /*
      * 配置成功的结果
      * */
      configPriceSuccess(res) {
        // console.log('配置成功的结果====', res)
        // this.editHouseInfo.house_price[0] = res
        this.isConfigPrice = false
      },
			findEidtHouseInfo(){
				if(this.editHouseInfo.id){
					this.$http.post('/house/oneHouse',{house_id:this.editHouseInfo.id})
					.then(res => {
						console.log('editHouseInfoeeee',res.data.data)
						
						if (res.status !== 200){
							return this.$Message.error('获取房屋信息数据失败！')
						} 
						this.houseInfo = res.data.data.house
						console.log('123')
						
						// this.$Message.success('获取房屋信息数据成功！')
					}).catch(err => {
						this.$Message.error('获取房屋信息数据失败！')
						console.log('错误信息',err)
					})
				}
				 this.isMain = true
			},
			findDPrice(){
				if(this.editHouseInfo.id){
					this.$http.post('/house/oneDPrice',{house_id:this.editHouseInfo.id})
					.then(res => {
						console.log('oneDPrice001',res.data.data.d_price)
						if (res.data === '没有权限') {
						  this.$Modal.error({
						    title: '警告',
						    content: '没有权限'
						  })
						  return false
						}
						if (res.status !== 200){
							return this.$Message.error('获取底价数据失败！')
						} 
						this.dprice = res.data.data.d_price
						
						// this.$Message.success('获取买受人数据成功！')
					}).catch(err => {
						this.$Message.error('获取底价数据失败！')
						console.log('错误信息',err)
					})
				}
			},
			findHousePrice(){
				if(this.editHouseInfo.id){
					this.$http.post('/house/oneHousePrice',{house_id:this.editHouseInfo.id})
					.then(res => {
						console.log('oneHousePrice001',res.data.data.price)
						if (res.data === '没有权限') {
						  this.$Modal.error({
						    title: '警告',
						    content: '没有权限'
						  })
						  return false
						}
						if (res.status !== 200){
							return this.$Message.error('获取职级表价数据失败！')
						} 
						this.housePrice = res.data.data.price
						
						// this.$Message.success('获取买受人数据成功！')
					}).catch(err => {
						this.$Message.error('获取职级表价数据失败！')
						console.log('错误信息',err)
					})
				}
			}
    }
  }
</script>

<style scoped>

</style>
