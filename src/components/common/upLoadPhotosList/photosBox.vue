<template>
  <div class="photos_wrap">
    <div class="header">
      <div class="left_wrap">
        <span v-if="!toSelect">我的相册</span>
        <Button type="success" @click="confirmAdd" v-if="toSelect">确认添加</Button>&nbsp;&nbsp;&nbsp;&nbsp;
        <Button type="warning" @click="cancleAdd" v-if="toSelect">取消添加</Button>
      </div>
      <!-- 选择之后会自动上传图片到指定的地址 -->
      <Upload
        multiple
        :on-success="handleSuccess"
        :max-size="2048"
        :show-upload-list="true"
        :on-exceeded-size="handleMaxSize"
        :format="['jpg','jpeg','png','gif']"
        :on-format-error="handleFormatError"
        @clearFiles="clearUpFiles"
        :headers="httpHeader"
        :action='actionurl'>
        <Button type="info" icon="ios-cloud-upload-outline">上传照片</Button>
      </Upload>
    </div>
    <!-- 照片上传成功后应该会自动添加到这里 -->
    <div class="content">
      <div class="photos_list_wrap">
        <div class="photos_item" v-for="(item,index) in displayList">
          <img :src="item">
          <div class="cover">
            <Icon v-if="!toSelect" size="38" type="ios-eye-outline" @click.native="handleView(item)"></Icon>
            <Icon v-if="!toSelect" size="38" type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
            <!-- 选择图片时显示 -->
            <Icon v-if="toSelect" size="50" type="ios-checkmark" @click.native="handleSelect($event,item)"></Icon>
          </div>
        </div>
      </div>

      <!--分页器-->
      <div class="page_wrap">
        <Page @on-change="changeTo" v-bind:total='totals' :page-size='pageSize' show-elevator></Page>
      </div>
    </div>
    <!--查看图片弹窗-->
    <Modal title="查看图片" v-model="visible">
      <img :src="imgName" v-if="visible" style="width: 100%">
    </Modal>

  </div>
</template>
<script>
  export default {
    name: "index",
    data() {
      return {
        // 获取到的都是图片的https地址
        displayList: [],
        // 控制图片查看弹窗
        visible: false,
        // 图片的总数
        totals: 0,
        // 被选中的图片
        selectPics: [],
        // 最后一张图片元素
        lastElm: '',
        selectOne: '',
        // 图片上传的地址
        actionurl: "https://control.fangbee.cn/worker/uploadPhotos",
        httpHeader: {
          'X-CSRF-TOKEN': csrf_token,
        },
        pageSize: 50
      }
    },
    // 两个需要父元素传递过来的值。toSelect: 是去选择吗，count: 选择多少张
    props: ['toSelect', 'count'],
    created() {
      this.$post("https://control.fangbee.cn/photoLists")
        .then((res) => {
          if (res.status_code !== 200) return this.$Message.error(res.status_msg)
          this.displayList = res.data.photoList
          this.totals = parseInt(res.data.count)
          // console.log(" this.displayList===", this.displayList)
          // console.log(" this.count===", this.totals)
        })
        .catch((error) => {
          this.$Message.error('获取我的相册内容失败.')
        })
    },
    methods: {
      /*
      * 确认要添加的图片，并把图片渲染到指定的位置
      * */
      confirmAdd() {
        if (this.count == 1) {
          if (!this.selectOne) {
            this.$Message.error('你还未选择要添加的照片.')
          } else {
            this.$emit('addPhotos', this.selectOne)
          }
        } else {
          if (this.selectPics.length < 1) {
            this.$Message.error('你还未选择要添加的照片.')
          } else {
            // 这个是子组件中的触发的事件，并将数据传递给父组件
            this.$emit('addPhotos', this.selectPics)
          }
        }
      },
      /*
      * 取消添加
      * */
      cancleAdd() {
        this.$emit('canclePhotos')
      },
      /*
      * 上传成功的回调
      * */
      handleSuccess(res) {
        this.displayList.unshift(res.file)
      },
      /*
      * 删除图片
      * */
      handleRemove(url) {

      },
      /*
      * 选择图片
      * */
      // e:事件对象；elem:选择的元素【应该也是https的图片地址】
      handleSelect(e, elem) {
        // console.log(e,'=============================',elem)
        if (this.count == 1) { // 只能选一张图片的情况
          this.selectOne = elem
          e.target.parentNode.setAttribute('style', 'display:block;opacity:1;color:red')
          e.target.setAttribute('style', 'display:block;font-size:80px;')
          if (this.lastElm) {
            this.lastElm.target.parentNode.setAttribute('style', 'display:normal;')
            this.lastElm.target.setAttribute('style', 'display:normal;font-size:50px;')
          }
          this.lastElm = e
          return
        } else if (this.count > 1) {  //可以选择多张图片的情况
          if (this.selectPics.length == this.count) {
            this.$Message.warning('你已经选择' + this.count + '张图片,不能再选啦!')
            return
          }
        }
        for (var i = 0; i < this.selectPics.length; i++) {
          if (this.selectPics[i].url == elem) {
            e.target.parentNode.setAttribute('style', 'display:normal;')
            e.target.setAttribute('style', 'display:normal;')
            this.selectPics.splice(i, 1)
            return
          }
        }
        this.selectPics.push({'url': elem})
        e.target.parentNode.setAttribute('style', 'display:block;opacity:1;color:red;')
        e.target.setAttribute('style', 'display:block;font-size:80px;')

      },
      clearUpFiles() {

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
      /*
      * 点击查看
      * */
      handleView(name) {
        this.imgName = name
        this.visible = true
      },
      /*
      * 分页器图片页面跳转
      * */
      changeTo(curPage) {
        this.$post('/photoLists',{page:curPage}).then(res=>{
          if (res.status_code!==200) return this.$Message.error('获取我的相册内容失败.')
          this.displayList = res.data.photoList
        })
          .catch((error) => {
            this.$Message.error('获取我的相册内容失败.')
          })
      }
    },
  }
</script>

<style lang="less">
  .photos_wrap {
    width: 100%;
    height: 100%;

    .header {
      width: 100%;
      padding: 15px 20px 5px;
      border-bottom: 2px solid #ddd;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left_wrap {
        span {
          font-size: 14px;
          font-weight: bold;
        }
      }
    }

    .content {
      width: 100%;

      .photos_list_wrap {
        font-size: 20px;
        display: flex;
        justify-content: flex-start;
        width: 100%;
        min-height: 200px;
        flex-wrap: wrap;

        .photos_item {
          position: relative;
          width: 80px;
          height: 80px;
          background-color: white;
          margin: 15px 10px;

          img  {
            width: 80px;
            height: 80px;
          }
        }

        .cover {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          display: flex;
          justify-content: space-around;
          align-items: center;

          i:hover {
            color: #fff;
          }

          &:hover {
            background-color: rgba(0, 0, 0, .2);
            opacity: 1;
          }
        }
      }

      .page_wrap {
        padding-top: 20px;
        margin: 0 auto;
        display: flex;
        justify-content: center;
      }
    }
  }

</style>
