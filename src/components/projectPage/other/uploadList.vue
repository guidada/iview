<template>
  <div class="uploads_list_container">
    <h2>导入日志</h2>
    <div class="table_wrap">
      <Table border :columns="columns" :data="historyList" :no-data-text="noDataText"></Table>
    </div>
    <!-- 分页器-->
    <div class="page_wrap">
      <Page :total="total" :page-size="pageSize" @on-change="pageChange"></Page>
    </div>
  </div>
</template>

<script>
  let Base64 = require('js-base64').Base64;
  export default {
    name: "uploadList",
    data() {
      return {
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
      this.getHistoryList()
    },
    methods: {
      /*
      * 获取到导入的历史记录
      * */
      getHistoryList(page) {
        var pageNum = page || 1
        var info = {
          project_id: parseInt(this.$route.params.id),
          page: pageNum
        }
        this.$post('/excelLog', info).then(res => {
          // console.log('获取历史记录===', res)
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
    }
  }
</script>

<style lang="less" scoped>
  .uploads_list_container {
    padding: 30px;
    h2 {
      border-bottom: 1px solid #aaa;
      line-height: 50px;
      margin-bottom: 30px;
    }

    .table_wrap {
      padding: 30px;
    }

    .page_wrap {
      margin-top: 30px;
      display: flex;
      justify-content: center;
    }
  }
</style>
