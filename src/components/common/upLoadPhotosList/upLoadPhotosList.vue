<template>
  <!-- 这是一个测试版，暂时不要使用-->
  <div>
    <div class="demo-upload-list" v-for="item in defaultList">
      <img :src="item.url">
      <span>{{item.url}}</span>
     <!-- <div class="demo-upload-list-cover">
        <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
        <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
      </div>-->
    </div>
    <Upload
      ref="upload"
      :show-upload-list="false"
      :on-success="handleSuccess"
      :format="['jpg','jpeg','png']"
      :max-size="2048"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      :on-progress="onProgress"
      :headers="httpHeader"
      multiple
      type="drag"
      :action="actionurl"
      style="display: inline-block;width:58px;">
      <div style="width: 58px;height:58px;line-height: 58px;">
        <Icon type="ios-camera" size="20"></Icon>
      </div>
    </Upload>
    <Modal title="View Image" v-model="visible">
      <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>
<script>
  export default {
    name: "upLoadPhotosList",
    data() {
      return {
        // 上传的路径
        actionurl: "https://control.fangbee.cn/uploadPhotos",
        //
        defaultList: [],
        imgName: '',
        visible: false,
        uploadList: [],
        httpHeader: {
          'X-CSRF-TOKEN': csrf_token,
        }
      }
    },
    methods: {
      handleView(name) {
        this.imgName = name
        this.visible = true
      },
      handleRemove(file) {
        const fileList = this.$refs.upload.fileList
        this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
      },
      handleSuccess(res, file) {
       this.$Message.success('成功！')
        // console.log(res)
        // console.log(file)
      },
      handleFormatError(file) {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: file.name + ' 的文件格式不正确，请选择jpg或png。'
        })
      },
      handleMaxSize(file) {
        this.$Notice.warning({
          title: '图片尺寸大小限制',
          desc: file.name + ' 太大, 不得大于 2M.'
        })
      },
      handleBeforeUpload() {
        const check = this.uploadList.length < 5
        if (!check) {
          this.$Notice.warning({
            title: '一次性最多上传5张图片'
          })
        }
        return check
      },
      onProgress(res) {
        // console.log('上传时的效果！', res)
      }
    },
    mounted() {
      this.uploadList = this.$refs.upload.fileList
    }
  }
</script>
<style>
  .demo-upload-list {
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
  }

  .demo-upload-list img {
    width: 100%;
    height: 100%;
  }

  .demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
  }

  .demo-upload-list:hover .demo-upload-list-cover {
    display: block;
  }

  .demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>



