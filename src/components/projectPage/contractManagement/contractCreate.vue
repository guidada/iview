<template>
  <div class="project-container">
    <Form :label-width="200">
        <FormItem label="关联房源：">
          <Row>
            <Col :span="6">
              <Cascader :data="buildingData" :load-data="loadData" v-model="building"></Cascader>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="上传合同附件：">
          <div class="form-item">
            <Upload
              :on-success="handleFactory"
              :max-size="2048"
              :show-upload-list="true"
              :on-exceeded-size="handleMaxSize"
              :format="['jpg','jpeg','png','gif']"
              :on-format-error="handleFormatError"
              :on-remove="fileRemove"
              :headers="httpHeader"
              :action='actionurl'>
              <Button type="info" icon="ios-cloud-upload-outline">上传照片</Button>
            </Upload>
          </div>
        </FormItem>
        <FormItem>
          <div class="form-item">
            <Button type="primary" @click="save">保存</Button>
            <Button type="default" @click="$router.go(-1)">返回</Button>
          </div>
        </FormItem>
    </Form>
  </div>
</template>

<script>
  export default {
    name: "contractCreate",
    data() {
      return {
        project_id: this.$route.params.id,
        project: [],
        fileList: [],
        building: [],
        buildingData: [],
        currentBuilding: '',
        // 图片上传的地址
        actionurl: "https://control.fangbee.cn/worker/uploadPhotos",
        httpHeader: {
          'X-CSRF-TOKEN': csrf_token,
        },
        clientRules: {
          name: { required: true, message: '客户姓名不能为空', trigger: 'blur' },
          phone: { required: true, message: '手机号不能为空', trigger: 'blur' },
          desc: { required: true, message: '备注不能为空', trigger: 'blur' },
          idcard: { required: true, message: '身份证号', trigger: 'blur' },
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
          positive_photo: { required: true, message: '身份证正面照不能为空', trigger: 'blur' },
          negative_photo: { required: true, message: '身份证背面照不能为空', trigger: 'blur' }
        }
      }  
    },
    methods: {
      getBuilding(id) {
          this.$post('/contract/contractConfig',{
            project_id: id || this.project_id
          }).then((res) => {
            if (res.data === '没有权限') {
              this.$Modal.error({
                title: '警告',
                content: '没有权限'
              })
              return false
            }
            let building = res.data.building
            building = building.map(item => {
              item.label = item.building_num + "幢"
              item.value = item.id
              item.children = []
              item.loading = false
              return item
            })
            this.buildingData = building
          })
      },
      save() {
        let file =[]
        if(this.fileList && this.fileList.length) {
          file = this.fileList.map(item => {
            return item.response.file
          })
        }else {
          this.$Message.error('请上传合同附件!')
          return false
        }
        this.$post('/contract/addContract', {
          project_id: this.project_id,
          building_id: this.building[0],
          unit_id: this.building[1],
          room: this.building[2] || 0,
          img: file
        }).then(res => {
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          this.$Message.success('保存成功')
          this.$router.replace('/project/'+this.project_id+'/contractManagement/contractList')
        })
      },
      fileRemove(res,file,fileList) {
        this.fileList = fileList
      },
      handleFactory(res,file,fileList) {
        this.fileList = fileList
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
      loadData (item, callback) {
        item.loading = true;
        let key,value
        if(item.building_num) {
          key = "building_id"
          value = item.id
        }else {
          key = "unit_id"
          value = item.id
        }
        let params = {
          project_id: this.project_id,
          [key]: value
        }
        if(params.unit_id) {
          params.building_id = this.currentBuilding
        }
        this.$post('/contract/contractConfig',params).then(res => {
          if(key == "building_id"){
            let unit = res.data.unit
            unit = unit.map(item => {
              item.label = item.unit_num + '单元'
              item.value = item.id
              item.loading = false
              item.children = []
              return item
            })
            item.children = unit
            this.currentBuilding = item.id
          }else {
            let house = res.data.house
            house = house.map(item => {
              item.label = item.room
              item.value = item.room
              return item
            })
            item.children = house
          }
          item.loading = false;
          callback();
        })
      }
    },
    props:['qianYueBuilding'],
    created() {
      this.getBuilding()
      this.building = [1,1,1]
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
