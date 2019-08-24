<template>
  <div class="project-container">
    <Form :model="form" ref="form" :label-width="200" :rules="clientRules">
        <FormItem label="主题名称：" prop="name">
          <div class="form-item">
            <Input v-model="form.name" placeholder="请输入主题名称"></Input>
          </div>
        </FormItem>
        <FormItem label="类型" prop="leixing"> 
          <div class="form-item">
            <RadioGroup v-model="form.leixing">
                <Radio label="认筹-排号">认筹-排号</Radio>
                <Radio label="认筹-落位">认筹-落位</Radio>
                <Radio label="认购">认购</Radio>
            </RadioGroup>
          </div>
        </FormItem>
        <FormItem label="起止日期：" prop="daterange">
          <div class="form-item">
            <DatePicker :value="beforedate" placeholder="请选择起止日期" @on-change="datepick" format="yyyy/MM/dd" type="daterange" placement="bottom-end" style="width: 200px"></DatePicker>
          </div>
        </FormItem>
        <FormItem label="优惠方式：" prop="type">
          <Row>
            <Col :span="6" style="font-size:0">
              <Select v-model="form.type" style="width:200px">
                  <Option value="先折后减">先折后减</Option>
                  <Option value="先减后折">先减后折</Option>
              </Select>
            </Col>
            <template v-if="form.type == '先折后减'">
              <Col :span="3" style="margin-left:20px;display:flex;word-break:keep-all">
                <Input v-model="form.discount" placeholder="几"></Input>
                <span>
                  折后
                </span>
              </Col>
              <Col :span="3" style="margin-left:20px;display:flex;word-break:keep-all">
                <span>
                  减
                </span>
                <Input v-model="form.reduce" placeholder="几"></Input>
                <span>
                  元
                </span>
              </Col>
            </template>
            <template v-else>
              <Col :span="3" style="margin-left:20px;display:flex;word-break:keep-all">
                <span>
                  减
                </span>
                <Input v-model="form.reduce" placeholder="几"></Input>
                <span>
                  元后
                </span>
              </Col>
              <Col :span="3" style="margin-left:20px;display:flex;word-break:keep-all">
                <Input v-model="form.discount" placeholder="几"></Input>
                <span>
                  折
                </span>
              </Col>
              <Col :span="3" style="margin-left:20px;display:flex;word-break:keep-all">
                折扣规范：88折写成8.8折
              </Col>
            </template>
          </Row>
        </FormItem>
        <FormItem label="认购金额：" prop="subscribe_price">
          <div class="form-item">
            <Row>
              <Col :span="9">
                <Input v-model="form.subscribe_price" placeholder="请输入认购金额"></Input>
              </Col>
              <Col :span="3">
                <span style="margin-left: 10px">
                  元
                </span>
              </Col>  
            </Row>
          </div>
        </FormItem>
        <FormItem label="认筹标准：" prop="renchou_price">
          <div class="form-item">
            <Row>
              <Col :span="9">
                <Input v-model="form.renchou_price" placeholder="请输入认筹标准"></Input>
              </Col>
              <Col :span="3">
                <span style="margin-left: 10px">
                  元
                </span>
              </Col>  
            </Row>
          </div>
        </FormItem>
        <FormItem>
          <div class="form-item">
            <Button type="primary" @click="save">保存</Button>
            <Button type="default" :to="'/project/'+this.$route.params.id+'/salesAndControl/salesActive'">取消</Button>
          </div>
        </FormItem>
    </Form>
  </div>
</template>

<script>
  import areaList from '@/components/config/district.js'
  export default {
    name: "activeEdit",
    data() {
      return {
        beforedate: [],
        form: {
          id: this.$route.params.id,
          name: '',
          daterange: [],
          leixing: "认筹-排号",
          type: 1, // 折扣方式
          discount: '', // 房屋总价折扣
          reduce: '', // 价格减免
          type: '',
          subscribe_price: '',
          renchou_price: '',
          start_time: '',
          end_time: ''
        },
        clientRules: {
          name: { required: true, message: '客户姓名不能为空', trigger: 'change' },
          leixing: { required: true, message: '活动类型不能为空', trigger: 'blur' },
          subscribe_price: { required: true, message: '认购金额不能为空', trigger: 'change' },
          daterange: { 
            message: '起止日期不能为空', 
            async: false,
            required: true,
            validator: (rule,value,callback) => {
                var errors = '起止日期不能为空'
                if(!this.form.start_time || !this.form.end_time){
                  callback(new Error(errors))
                }
                callback()
            },
            trigger: 'blur' 
          },
          idcard: { required: true, pattern: /^[1-9][0-7]\d{4}((19\d{2}(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(19\d{2}(0[13578]|1[02])31)|(19\d{2}02(0[1-9]|1\d|2[0-8]))|(19([13579][26]|[2468][048]|0[48])0229))\d{3}(\d|X|x)?$/, message: '身份证号格式不正确', trigger: 'blur' },
        },
      }  
    },
    created() {
      let data = this.$route.params
      data.start_time = data.start_time.date
      data.end_time = data.end_time.date
      data.renchou_price = String(data.renchou_price)
      data.subscribe_price = String(data.subscribe_price)
      this.form = this.$route.params
      this.beforedate = [new Date(this.$route.params.start_time),new Date(this.$route.params.end_time)]
    },
    methods: {
      datepick(date) {
        this.form.start_time = date[0]
        this.form.end_time = date[1]
      },
      save() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.form.project_id = this.$route.params.id
            this.form.id = this.$route.params.uid
            this.$post('/activity/updateActivity', this.form).then(res => {
              if (res.data === '没有权限') {
                this.$Modal.error({
                  title: '警告',
                  content: '没有权限'
                })
                return false
              }
              this.$Message.success('保存成功')
              this.$router.replace('/project/'+this.form.project_id+'/salesAndControl/salesActive')
            })
          } else {
            this.$Message.error('请输入必填信息~');
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
.search-panel {
  .search-item {
    &__label {
     line-height: 32px;
     text-align: center; 
    }
  }
}
.project-container {
  padding: 20px 30px 50px;
}
.client-content {
  margin: 20px 0;
}
.form-item {
  width: 300px;
}
</style>
