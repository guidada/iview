<template>
  <!--这是编辑楼栋信息的页面，此页面不处理新增楼栋信息-->
  <div class="add_building_container">
    <div class="header">编辑楼栋</div>
    <Form class="form" ref="projectForm" :model="buildingInfo" :rules="buildingRules" :label-width="120">
      <!--前三行是基本信息-->
      <Row>
        <Col span="10">
          <FormItem label="楼栋号：" prop="building_num">
            <div style="display: flex;justify-content: flex-start">
              <Input v-model="buildingInfo.building_num" disabled></Input>
              <span style="line-height: 30px;margin-left: 9px">幢</span>
            </div>
          </FormItem>
        </Col>
        <Col span="10" offset="2">
          <FormItem label="货值计算：" prop="value_count">
            <div style="display: flex;justify-content: flex-start">
              <InputNumber
                style="width: 100%"
                :min="1"
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => `${value}`.replace(/￥\s?|(,*)/g, '')"
                v-model="buildingInfo.value_count || null"
                placeholder="请输入金额"></InputNumber>
              <span style="line-height: 30px;margin-left: 9px">元</span>
            </div>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="10">
          <FormItem label="楼栋建筑面积：" prop="mianji">
            <div style="display: flex;justify-content: flex-start">
              <InputNumber
                style="width: 100%"
                :min="1"
                v-model="buildingInfo.mianji"
                placeholder="请输入面积"></InputNumber>
              <span style="line-height: 30px;margin-left: 9px">㎡</span>
            </div>
          </FormItem>
        </Col>
        <Col span="10" offset="2">
          <FormItem label="预计交房时间：" prop="pay_time">
            <DatePicker v-model="buildingInfo.pay_time" type="month" placeholder="请选择月份"></DatePicker>
          </FormItem>
        </Col>
      </Row>
      <Row style="border-bottom: 1px dashed #999999">
        <Col span="11">
          <FormItem label="物业类型：" prop="property_type">
            <CheckboxGroup v-model="buildingInfo.property_type">
              <!--<Checkbox label="别墅"></Checkbox>-->
              <Checkbox label="住宅"></Checkbox>
              <Checkbox label="商铺"></Checkbox>
              <!--<Checkbox label="公寓"></Checkbox>-->
              <!--<Checkbox label="写字楼"></Checkbox>-->
            </CheckboxGroup>
          </FormItem>
        </Col>
        <Col span="10" offset="1">
          <FormItem label="楼栋描述：">
            <Input v-model="buildingInfo.desc" placeholder="请简述" type="textarea"></Input>
          </FormItem>
        </Col>
      </Row>
      <!--单元楼相关信息-->
      <Row style="margin-top: 10px">
        <Col span="10">
          <FormItem label="该楼栋共有：">
            <div style="display: flex;justify-content: flex-start">
              <Input v-model="buildingInfo.unit_count || 1" disabled></Input>
              <span style="line-height: 30px;margin-left: 9px;width: 50px">个单元</span>
            </div>
          </FormItem>
        </Col>
      </Row>
      <div style="background-color: #e7e7e7;padding: 20px 0;margin-bottom: 20px">
        <Row v-for="(item,index) in buildingInfo.unit" :key="index">
          <Col span="6">
            <FormItem label="所属单元：" prop="name">
              <div style="display: flex;justify-content: flex-start">
                <InputNumber
                  :min="1"
                  :max="4"
                  v-model="item.unit_num"
                ></InputNumber>
                <span style="line-height: 30px;margin-left: 9px;width: 50px">单元</span>
              </div>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="梯户比：" prop="name">
              <div style="display: flex;justify-content: flex-start">
                <InputNumber
                  :min="1"
                  :max="10"
                  v-model="item.ladder"
                ></InputNumber>
                <span style="line-height: 30px;margin-left: 9px">梯</span>
                <InputNumber
                  :min="1"
                  :max="10"
                  v-model="item.door"
                  style="line-height: 30px;margin-left: 9px"
                ></InputNumber>
                <span style="line-height: 30px;margin-left: 9px">户</span>
              </div>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="楼层数：" prop="name">
              <div style="display: flex;justify-content: flex-start">
                <InputNumber
                  style="width: 100%"
                  :min="1"
                  :max="250"
                  v-model="item.floor_count"
                  placeholder="请输入楼层数"
                ></InputNumber>
                <span style="line-height: 30px;margin-left: 9px">层</span>
              </div>
            </FormItem>
          </Col>
          <Col span="1" offset="1" style="display: flex;justify-content: center;">
            <Icon type="ios-close-circle-outline"
                  @click="deleteUnit(index)"
                  size="30"
                  color="red"
                  style="cursor: pointer"/>
          </Col>
        </Row>
        <div style="display: flex;justify-content: center">
          <Button type="info" style="padding: 6px">
            <Icon type="ios-add"
                  size="20"
                  @click="addUnit"
            />
          </Button>
        </div>
      </div>
      <!--提交按钮-->
      <div style="display: flex;justify-content: center">
        <Button type="info" @click="submitForm('projectForm')">确认</Button>
        <Button style="margin-left: 20px" @click="goback">返回</Button>
      </div>
    </Form>
  </div>
</template>

<script>
  export default {
    name: "addBuilding",
    data() {
      return {
        // 楼栋信息
        buildingInfo: {
          id: null,
          desc: '',
          mianji: null,
          pay_time: '',
          value_count: null,
          unit_count: 1,
          building_num: 1,
          property_type: ['住宅'],
          unit: [
            {
              id: null,
              unit_num: 1,
              ladder: 1,
              door: 1,
              floor_count: 1
            }
          ],
        },
        // 楼栋表单验证规则
        buildingRules: {
          building_num: [{
            required: true,
            type: 'number',
            message: '楼栋号不能为空',
            trigger: 'blur'
          }],
          value_count: [{
            // required: true,
            type: 'number',
            message: '金额不能为空',
            trigger: 'blur'
          }],
          mianji: [{
            required: true,
            type: 'number',
            message: '面积不能为空',
            trigger: 'blur'
          }],
           pay_time: [{
             required: true,
             type: 'date',
             message: '交房时间不能为空',
             trigger: 'blur'
           }],
          property_type: [{
            required: true,
            type: 'array',
            message: '物业类型不能为空',
            trigger: 'blur'
          }],
        }
      }
    },
    props: ['editBuildingInfo'],
    created() {
      var buildingInfo = this.editBuildingInfo
      buildingInfo.property_type = buildingInfo.property_type ? buildingInfo.property_type : []
      if (buildingInfo.unit.length === 0) {
        buildingInfo.unit_count = 1
        buildingInfo.unit.push({
          id: null,
          unit_num: 1,
          ladder: 1,
          door: 1,
          floor_count: 1
        })
      }
      this.buildingInfo = buildingInfo
      // console.log('buildingInfo', buildingInfo)
    },
    methods: {
      goback() {
        // this.buildingInfo = this.editBuildingInfo
        this.$emit('cancelEditBuilding')
      },
      /*
      * 添加单元
      * */
      addUnit() {
        var buildingInfo = this.buildingInfo
        if (buildingInfo.unit_count > 3) return this.$Message.error('最多四个单元')
        buildingInfo.unit_count += 1
        buildingInfo.unit.push({
          id: null,
          unit_num: 1,
          ladder: 1,
          door: 1,
          floor_count: 1
        })
        this.buildingInfo = buildingInfo
      },
      /*
      * 删除单元
      * */
      deleteUnit(i) {
        var buildingInfo = this.buildingInfo
        if (buildingInfo.unit_count <= 1) return this.$Message.error('至少保留一个单元')
        buildingInfo.unit.forEach((item, index) => {
          if (index === i) {
            buildingInfo.unit.splice(index, 1)
          }
        })
        buildingInfo.unit_count -= 1
        this.buildingInfo = buildingInfo
      },
      /*
      *  提交楼栋编辑信息
      * */
      submitForm(name) {
        var buildingInfo = this.buildingInfo
        this.$refs[name].validate((valid) => {
          if (!valid) return this.$Message.error('请完善信息~')

          //判断单元的名字是否重复
          var flag = false
          if (buildingInfo.unit_count > 1) {
            for (let i = 0; i < buildingInfo.unit.length; i++) {
              for (let j = i + 1; j < buildingInfo.unit.length; j++) {
                if (buildingInfo.unit[i].unit_num === buildingInfo.unit[j].unit_num) {
                  flag = true
                }
              }
            }
          }
          if (flag) return this.$Message.error('单元号重复！')

          // 时间格式化处理]
          var pay_time = buildingInfo.pay_time
          buildingInfo.pay_time =typeof(pay_time) === 'string' ?pay_time : this.commatTime(new Date(pay_time))

           // console.log('编辑后的信息===',buildingInfo)
           this.$post('/building/updateBuilding', buildingInfo).then(res => {
             if (res.data === '没有权限') {
               this.$Modal.error({
                 title: '警告',
                 content: '没有权限'
               })
               return false
             }
             if (res.status_code !== 200) return this.$Message.error('编辑楼栋信息失败！')
             this.$Message.success('编辑楼栋信息成功！')
             var result = res.data
             result.mianji = parseFloat(result.mianji) || null
             result.value_count = parseFloat(result.value_count) || null
             result.unit_count = parseInt(result.unit_count)
             result.pay_time = result.pay_time.date  || new Date()
             result.property_type = result.property_type.split(' ')
             // console.log('获取到数据，处理后的结果result',result)
             this.$emit('editBuildingSuccess', result)
           }).catch(err => {
             this.$Message.error('warning：编辑楼栋信息失败！')
             this.$emit('cancelEditBuilding')
           })

        })
      },
      /*
      * 格式化时间
      * */
      commatTime(t) {
        var year = t.getFullYear()
        var mouth = t.getMonth() + 1
        return year + '-' + (mouth < 10 ? '0' + mouth : mouth)
      },
    },
    watch: {
      buildingInfo() {
        if (typeof this.buildingInfo.pay_time === 'string') {
          this.buildingInfo.pay_time = new Date(this.buildingInfo.pay_time);
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .add_building_container {
    width: 900px;
    background-color: #ffffff;
    padding: 20px 15px;

    .header {
      font-size: 16px;
      padding-bottom: 20px;
      margin-bottom: 20px;
      text-indent: 0.5em;
      border-bottom: 1px solid black;
    }
  }
</style>
