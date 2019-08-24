<template>
  <div class="project-container">
    <div class="search-panel">
      <div class="search-itme">
        <Row>
          <Col span="2">
            <div class="search-item__label">
              主题名称：
            </div>
          </Col>
          <Col span="8">
            <Input @on-search="getData" search enter-button v-model="clientName" placeholder="请输入主题名称" />
          </Col>
        </Row>
      </div>
      <div class="operation-panel">
        <Button type="primary" :to="'/project/'+this.project_id+'/salesAndControl/activeCreate'">新建活动</Button>
      </div>
      <div class="client-content">
        <Table border :columns="columns" :data="data" :no-data-text="noDataText2"></Table>
      </div>
      <Page :total="total" :page-size="pageSize" @on-change="getData" :current.sync="current"></Page>
      <Modal v-model="sortShow" width="1000">
          <p slot="header" style="text-align:center">
              <span>{{sortName}}排位表</span>
          </p>
          <div style="text-align:center">
            <Table :columns="sortColumns" :data="sortData" :no-data-text="noDataText2"></Table>
          </div>
          <div slot="footer">
            <Page :total="sortTotal" :page-size="10" @on-change="sortTable" :current.sync="sortPage"></Page>
          </div>
      </Modal>
    </div>
  </div>
</template>

<script>
  export default {
    name: "saleActive",
    data() {
      return {
        sortTotal: 0,
        sortShow: false,
        sortData: [],
        sortName: '',
        sortPage: 1,
        sortColumns: [
            {
                title: '排号',
                render: (h, params) => {
                  let number = params.index + 1 + (this.sortPage - 1) * 10
                  return h('div', number);
                }
            },
            {
                title: '客户姓名',
                render: (h, params) => {
                  return h('div', params.row.customer.name);
                }
            },
            {
              title: '联系方式',
              render: (h, params) => {
                return h('div', params.row.customer.phone);
              }
            },
            {
                title: '认筹金额',
                key: 'price'
            },
            {
                title: '添加时间',
                key: 'customer_time'
            },
            {
                title: '置业顾问',
                key: 'worker_name'
            },
        ],
        columns: [
            {
                title: 'ID',
                key: 'id'
            },
            {
                title: '主题名称',
                key: 'name'
            },
            {
                title: '类型',
                key: 'leixing'
            },
            {
              title: '起止时间',
                key: 'action',
                width: 150,
                align: 'center',
                render: (h, params) => {
                  return h('div', this.formatTime(params.row.start_time.date) + '-' + this.formatTime(params.row.end_time.date));
                }
            },
            {
                title: '状态',
                key: 'created_at',
                render: (h, params) => {
                  let status = '进行中'
                  if(new Date(params.row.start_time.date) > new Date()) {
                    status = "等待开始"
                  }
                  if(new Date(params.row.end_time.date) < new Date()) {
                    status = "已结束"
                  }
                  return h('div', status);
                }
            },
            {
                title: '操作',
                key: 'action',
                width: 200,
                align: 'center',
                render: (h, params) => {
                    return h('div', [
                        h('Button', {
                            props: {
                                type: 'text',
                                size: 'small'
                            },
                            style: {
                                marginRight: '5px',
                                color: '#2d8cf0'
                            },
                            on: {
                                click: () => {
                                    this.ClientView(params.row)
                                }
                            }
                        }, '查看'),
                        h('Button', {
                            props: {
                                type: 'text',
                                size: 'small'
                            },
                            style: {
                              color: '#2d8cf0'
                            },
                            on: {
                                click: () => {
                                    this.ClientEdit(params.row)
                                }
                            }
                        }, '编辑'),
                        h('Button', {
                            props: {
                                type: 'text',
                                size: 'small'
                            },
                            style: {
                              color: '#47cb89'
                            },
                            on: {
                                click: () => {
                                    this.activity_id = params.row.id
                                    this.sortName = params.row.name
                                    this.sortTable(1)
                                }
                            }
                        }, '排位表')
                    ]);
                }
            }
        ],
        data: [],
        clientName: '',
        total: 0,
        pageSize: 10,
        current: 1,
        project_id: this.$route.params.id,
        activity_id: 0,
        noDataText1:'暂无数据',
        noDataText2:'暂无数据'
      }
    },
    methods: {
      sortTable(page) {
        this.$post('/activity/rowNumber', {
          activity_id: this.activity_id
        }).then(res => {
          if (res.data === '没有权限') {
            this.noDataText1 = '没有权限'
            return false
          }
          this.sortData = res.data.row
          this.sortTotal = res.data.count
          this.sortShow = true
        })
      },
      formatTime(data) {
        return new Date(data).getFullYear() + '/' + (new Date(data).getMonth()+1) + '/' + new Date(data).getDate()
      },
      getData(page) {
        this.current = page
        this.$post('/activity/lists',{
          project_id: this.project_id,
          page: this.current,
          name: this.clientName
        }).then(res => {
          if (res.data === '没有权限') {
            this.noDataText2 = '没有权限'
            return false
          }
          this.total = res.data.count
          this.data = res.data.activity
        })
      },
      ClientView(data) {
        let uid = data.id
        data.id = this.project_id
        data.uid = uid
        this.$router.push({
          name: 'activeView',
          params: data
        })
      },
      ClientEdit(data) {
        let uid = data.id
        data.id = this.project_id
        data.uid = uid
        this.$router.push({
          name: 'activeEdit',
          params: data
        })
      }
    },
    created() {
      this.getData()
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
.operation-panel {
  margin-top: 20px;
}
</style>
