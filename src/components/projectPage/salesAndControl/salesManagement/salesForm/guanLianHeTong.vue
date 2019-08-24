<template>
  <div class="guan_lian_he_tong_container">
    <h3>关联合同</h3>
    <Form :label-width="200">
      <FormItem label="关联房源：">
        <Row>
          <Col :span="6">
            <span>{{houseNum}}</span>
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
            :default-file-list="fileDefault"
            :action='actionurl'>
            <Button type="info" icon="ios-cloud-upload-outline">上传照片</Button>
          </Upload>
        </div>
      </FormItem>
      <div class="btn_wrap">
        <Button type="primary" @click="submitForm">保存</Button>
        <Button type="default" @click="goBack" style="margin-left: 30px">返回</Button>
      </div>
    </Form>
  </div>
</template>

<script>
  export default {
    name: "guanLianHeTong",
    props: ['houseNum', 'heTongInfo'],
    data() {
      return {
        fileDefault: [],
        fileList: [],
        // 图片上传的地址
        actionurl: "https://control.fangbee.cn/worker/uploadPhotos",
        httpHeader: {
          'X-CSRF-TOKEN': csrf_token,
        },
      }
    },
    created() {
      this.heTongInfo.img.forEach((item, index) => {
        this.fileDefault.push({
          name: '附件' + index,
          response: {
            file: item
          }
        })
      })
    },
    methods: {
      goBack() {
        this.$emit('cancelSunmit')
      },
      /*
      * 提交表单
      * */
      submitForm() {
        var heTongInfo = this.heTongInfo
        let file = []
        if (this.fileList && this.fileList.length) {
          file = this.fileList.map(item => {
            return item.response.file
          })
        } else {
          this.$Message.error('请上传合同附件!')
          return false
        }
        this.$post('/contract/addContract', {
          project_id: heTongInfo.project_id,
          building_id: heTongInfo.building_id,
          unit_id: heTongInfo.unit_id,
          room: heTongInfo.room,
          img: file,
        }).then(res => {
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('关联合同失败')
          if (res.data === '该房源不存在') return this.$Message.error('该房源不存在')
          this.$Message.success('保存成功')
          this.$emit('submitFormSuccess', res.data)
        }).catch(err => {
          this.$Message.success('关联合同失败')
        })
      },
      fileRemove(res, file, fileList) {
        this.fileList = fileList
      },
      handleFactory(res, file, fileList) {
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
    }
  }
</script>

<style lang="less" scoped>
  .guan_lian_he_tong_container {
    padding: 20px;
    h3 {
      padding: 0 20px 10px;
      border-bottom: 1px solid #aaaaaa;
      margin-bottom: 20px;
      font-size: 16px;
    }
    .btn_wrap {
      display: flex;
      justify-content: center;
    }
  }
</style>
