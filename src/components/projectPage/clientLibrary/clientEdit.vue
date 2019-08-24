<template>
  <div class="project-container">
    <Form :model="form" ref="form" :label-width="200" :rules="clientRules">
        <FormItem label="客户姓名：" prop="name">
          <div class="form-item">
            <Input v-model="form.name" placeholder="请输入真实姓名"></Input>
          </div>
        </FormItem>
        <FormItem label="客户性别" prop="sex"> 
          <div class="form-item">
            <RadioGroup v-model="form.sex">
                <Radio :label="1">男</Radio>
                <Radio :label="2">女</Radio>
            </RadioGroup>
          </div>
        </FormItem>
        <FormItem label="联系方式：" prop="phone">
          <div class="form-item">
            <Input v-model="form.phone" placeholder="请输入有效手机号码"></Input>
          </div>
        </FormItem>
        <FormItem label="居住地址：" prop="address">
          <Row>
            <Col :span="6">
              <Cascader :data="areaList" v-model="area"></Cascader>
            </Col>
            <Col :span="6" style="font-size:0px;margin-left:20px">
              <Input v-model="form.address" placeholder="请输入详细地址"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="身份证号：" prop="idcard">
          <div class="form-item">
            <Input v-model="form.idcard" placeholder="请输入身份证号"></Input>
          </div>
        </FormItem>
        <FormItem label="身份证正面照：" prop="positive_photo">
          <div class="form-item">
            <Upload
              :on-success="handleFactory('positive_photo')"
              :max-size="2048"
              :show-upload-list="true"
              :on-exceeded-size="handleMaxSize"
              :format="['jpg','jpeg','png','gif']"
              :on-format-error="handleFormatError"
              :on-remove="fileRemove('positive_photo')"
              :before-upload="flieReady('positive_photo')"
              :headers="httpHeader"
              :default-file-list="positive_photo_default"
              :action='actionurl'>
              <Button type="info" icon="ios-cloud-upload-outline">上传照片</Button>
            </Upload>
          </div>
        </FormItem>
        <FormItem label="身份证反面照：" prop="negative_photo">
          <div class="form-item">
            <Upload
              :on-success="handleFactory('negative_photo')"
              :max-size="2048"
              :show-upload-list="true"
              :on-exceeded-size="handleMaxSize"
              :format="['jpg','jpeg','png','gif','pdf']"
              :on-format-error="handleFormatError"
              :on-remove="fileRemove('negative_photo')"
              :before-upload="flieReady('negative_photo')"
              :headers="httpHeader"
              :default-file-list="negative_photo_default"
              :action='actionurl'>
              <Button type="info" icon="ios-cloud-upload-outline">上传照片</Button>
            </Upload>
          </div>
        </FormItem>
        <FormItem label="备注：" prop="desc">
          <div class="form-item">
            <Input v-model="form.desc" placeholder="请输入备注"></Input>
          </div>
        </FormItem>
        <FormItem>
          <div class="form-item">
            <Button type="primary" @click="save">保存</Button>
            <Button type="default" :to="'/project/'+this.$route.params.id+'/clientLibrary/clientManagement'">取消</Button>
          </div>
        </FormItem>
    </Form>
  </div>
</template>

<script>
  import areaList from '@/components/config/district.js'
  export default {
    name: "clientCreate",
    data() {
      return {
        original_number: '',
        form: {
          project_id: this.$route.params.id,
          name: '',
          phone: '',
          sex: 0,
          desc: '',
          idcard: '',
          address: '',
          city: '',
          province: '',
          district: '',
          positive_photo: '',
          negative_photo: '',
          positive_photo_default: [],
          negative_photo_default: []
        },
        area: [],
        areaList: areaList,
        // 图片上传的地址
        actionurl: "https://control.fangbee.cn/worker/uploadPhotos",
        httpHeader: {
          'X-CSRF-TOKEN': csrf_token,
        },
        clientRules: {
          name: { required: true, message: '客户姓名不能为空', trigger: 'blur' },
          phone: { required: true, trigger: 'blur',
            validator: (rule,value,callback) => {
                if(!/^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/.test(value)) {
                  callback(new Error('手机号格式不正确'))
                }
                if(value == this.original_number) {
                  callback()
                }
                this.$post('change/customerCondition',{
                  project_id: parseInt(this.$route.params.id),
                  name_phone: value
                }).then(res => {
                  if (res.data === '没有权限') {
                    this.$Modal.error({
                      title: '警告',
                      content: '没有权限'
                    })
                    return false
                  }
                  var errors = '客户手机号已存在！'
                  if(res.data.customer && res.data.customer.length > 0) {
                    callback(new Error(errors))
                  }else {
                    callback()
                  }
                })
            }
          },
          idcard: { required: true, pattern: /^[1-9][0-7]\d{4}((19\d{2}(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(19\d{2}(0[13578]|1[02])31)|(19\d{2}02(0[1-9]|1\d|2[0-8]))|(19([13579][26]|[2468][048]|0[48])0229))\d{3}(\d|X|x)?$/, message: '身份证号格式不正确', trigger: 'blur' },
          address: { 
            message: '地址不能为空', 
            async: false,
            validator: (rule,value,callback) => {
                var errors = '地址不能为空'
                if(!value|| !this.area.length){
                  callback(new Error(errors))
                }
                callback()
            },
          },
          // positive_photo: { required: true, message: '身份证正面照不能为空', trigger: 'blur' },
          // negative_photo: { required: true, message: '身份证背面照不能为空', trigger: 'blur' }
        }
      }  
    },
    methods: {
      areaFormat() {
        let area = this.area
        let result = []
        if(area.length) {
          areaList.forEach(province => {
            if(province.value == area[0]){
              province.children.forEach(city => {
                if(city.value == area[1]) {
                  city.children.forEach(district => {
                    if(district.value == area[2]){
                      result = [province.label,province.label,province.label]
                    }
                  })
                }
              })
            }
          })
        }
        return result
      },
      save() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let area = this.areaFormat()
            if(area.length) {
              var areamap = ['province','city','district']
              area.forEach((item,index) => {
                this.form[areamap[index]] = item
              })
            }
            this.form.id = this.form.uid
            this.$post('/customer/updateCustomer', this.form).then(res => {
              if (res.data === '没有权限') {
                this.$Modal.error({
                  title: '警告',
                  content: '没有权限'
                })
                return false
              }
              this.$Message.success('保存成功')
              this.$router.replace('/project/'+this.form.project_id+'/clientLibrary/clientManagement')
            })
          } else {
            this.$Message.error('请输入必填信息~');
          }
        })
      },
      flieReady(key) {
        return () => {
          if(this.form[key]){
            this.$Notice.warning({
              title: '图片文件已存在',
              desc: '图片文件已存在，请删除后重新上传'
            })
            return false
          }
        }
      },
      fileRemove(key) {
        return () => {
          this.form[key] = ''
        }
      },
      handleFactory(key) {
        return (res) => {
          this.form[key] = res.file
        }
      },
      /*
      * 上传图片格式验证
      * */
      handleFormatError(file) {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
        })
      },
      /*
      * 上传图片尺寸大小验证
      * */
      handleMaxSize(file) {
        this.$Notice.warning({
          title: '超出文件大小限制',
          desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
        })
      },
      initArea(data) {
        let result = []
        areaList.forEach(province => {
          if(province.label == data.province){
            province.children.forEach(city => {
              if(city.label == data.city) {
                city.children.forEach(district => {
                  if(district.label == data.district){
                    result = [province.value,city.value,district.value]
                  }
                })
              }
            })
          }
        })
        this.area = result
      }
    },
    created() {
      this.original_number = this.$route.params.phone
      this.form = this.$route.params
      this.initArea(this.$route.params)
      this.positive_photo_default = [{
        name: '身份证正面照',
        url: this.$route.params.positive_photo
      }]
      this.negative_photo_default = [{
        name: '身份证正面照',
        url: this.$route.params.negative_photo
      }]
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
