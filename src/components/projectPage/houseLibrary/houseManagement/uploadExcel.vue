<template>
  <div class="upload_excel_container">
    <div class="header">
      <!--,'xlsx','xlsm','xltx','xltm','xlsb','xlam'-->
      <Upload
        ref="upload"
        :show-upload-list="false"
        :on-success="handleSuccess"
        :format="['xls','xlsx']"
        :max-size="2048"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :on-progress="onProgress"
        :headers="httpHeader"
        :action="actionurl"
        :data="excelData"
      >
        <Button type="primary">
          <Icon type="ios-cloud-upload-outline" size="16" style="margin-right: 5px"/>
          <span>导入数据</span>
        </Button>
      </Upload>
      <!--<span class="tips"> <span style="color: red">提示：</span>:请严格按照模板格式导入数据，点击下方 <span style="color: #348EED">下载格式模板</span> 按钮获取模板</span>-->
      <Button type="warning" style=" margin-left: 30px;">
        <a
          style="color: #ffffff"
          type="download"
          href="https://control.fangbee.cn/房源导入数据示例.xls">下载格式模板</a>
      </Button>
    </div>
    <div class="content">
      <div class="tips">
        <span style="color: red">注意：</span>
        当前支持xls、xlsx格式文件，请使用Office 2007及以上版本，否则可能出现乱码；必须严格按照模版内容填入客户数据，否则可能会出现导入异常下载文件模版
      </div>
      <h3>{{currentBuildingInfo.building_num}}#楼--导入日志</h3>
      <div v-if="historyList.length" style="height: 200px;overflow-y: scroll">
        <Table border :columns="columns" :data="historyList" :no-data-text="noDataText"></Table>
        <!-- 分页器-->
        <div class="page_wrap">
          <Page :total="total" :page-size="pageSize" @on-change="pageChange"></Page>
        </div>
      </div>
      <div v-else class="inner_tips">
        暂未导入数据
      </div>
    </div>
    <div class="btn_wrap">
      <Button type="primary" @click="goback">确认</Button>
      <Button style="margin-left: 20px" @click="goback">返回</Button>
    </div>
  </div>
</template>

<script>
  let Base64 = require('js-base64').Base64
  export default {
    name: "uploadExcel",
    props: ['currentBuildingInfo'],
    data() {
      return {
        // 上传的路径
        actionurl: "https://control.fangbee.cn/excelSj",
        // 上传的参数
        excelData: {
          project_id: parseInt(this.$route.params.id),
          building_id: this.currentBuildingInfo.id,
          // house_id: 2
        },
        httpHeader: {
          'X-CSRF-TOKEN': csrf_token,
        },
        // 导入日志列表
        historyList: [],
        columns: [
          {title: '序号', key: 'index', align: 'center', width: 120},
          {title: '错误内容', key: 'error', align: 'center'},
          {title: '操作时间', key: 'updated_at', align: 'center', width: 160},
          {title: '操作人员', key: 'worker_name', align: 'center', width: 160},
        ],
        total: 0,
        pageSize: 10,
        noDataText: '暂无数据',
      }
    },
    created() {
      // console.log(this.currentBuildingInfo)
      this.getHistoryList()
    },
    methods: {
      goback() {
        this.$emit('cancelUpload')
      },
      handleSuccess(res, file) {
        this.$Message.success('导入数据成功！')
        setTimeout(() => {
          location.reload()
        }, 500)
      },
      handleFormatError(file) {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: file.name + ' 的文件格式不正确，请选择excel文件。'
        })
      },
      handleMaxSize(file) {
        this.$Notice.warning({
          title: '文件尺寸大小限制',
          desc: file.name + ' 太大, 不得大于 2M.'
        })
      },
      onProgress(res) {
        // console.log('上传时的效果！', res)
      },
      /*
      *  获取到导入日志列表
      * */
      getHistoryList(page) {
        var pageNum = page || 1
        var info = {
          building_id: this.currentBuildingInfo.id,
          page: pageNum
        }
        this.$post('/buildingExcelLog', info).then(res => {
					console.log('hisres',res)
          if (res.data === '没有权限') {
            this.noDataText = '没有权限'
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('获取历史记录失败！')
          // this.$Message.success('获取历史记录成功！')
          var result = res.data.log
          var log = []
          result.forEach((item, index) => {
            log.push({
              index: (pageNum - 1) * 10 + index + 1,
              error: item.error,
              updated_at: item.updated_at,
              worker_name: Base64.decode(item.worker.name),
            })
          })
          this.historyList = log
          this.total = res.data.count
        }).catch(err => {
          this.$Message.error('获取历史记录失败！')
        })
      },
      /*
     *  页面切换的处理
     * */
      pageChange(page) {
        this.getHistoryList(page)
      },
    },
  }
</script>

<style lang="less" scoped>
  .upload_excel_container {
    width: 900px;
    height: 500px;
    background-color: #ffffff;
    padding: 30px;

    .header {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 30px;

      .tips {
        color: #aaa;
      }

    }

    .content {
      font-size: 14px;
      height: 320px;

      h3 {
        padding: 5px 0;
        border-bottom: 1px solid #aaa;
        margin-bottom: 10px;
      }

      .tips {
        color: #999999;
        /*margin-left: 50px;*/
      }

      .inner_tips {
        color: #cccccc;
        text-align: center;
        line-height: 250px;
        font-size: 16px;
        /*display: none;*/
      }
      .page_wrap {
        margin-top: 30px;
        display: flex;
        justify-content: center;
      }
    }

    .btn_wrap {
      display: flex;
      justify-content: center;
    }
  }
</style>
