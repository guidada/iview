<template>
	
  <div class="project-container">
		<!-- <div v-if='isUploadExcel' class="modal_wrap"> -->
		 <Modal v-model="isUploadExcel" width="950" :footer-hide='true'>
			<uploadExcel @cancelUpload='cancelUpload'></uploadExcel>
			</Modal>
		<!-- </div> -->
    <div class="search-panel">
      <div class="search-itme">
        <Row>
          <Col span="2">
            <div class="search-item__label">
              客户姓名：
            </div>
          </Col>
          <Col span="8">
            <Input @on-search="getData(1)" search enter-button v-model="clientName" placeholder="请输入客户姓名" />
          </Col>
        </Row>
      </div>
    </div>
    <div class="operation-panel">
      <Button type="primary" :to="'/project/'+this.project_id+'/clientLibrary/clientCreate'">新建客户</Button>
			<Button type="primary" @click="gotoUploadExcel">
				<Icon type="ios-cloud-upload-outline" size="16" style="margin-right: 5px" />
				<span>导入数据</span>
			</Button>
		</div>
    <div class="client-content">
      <Table border :columns="columns" :data="data" :no-data-text="noDataText1"></Table>
    </div>
		<div style="display: flex; justify-content: center;">
    <Page :total="total" :page-size="pageSize" @on-change="getData" :current.sync="current"></Page>
		</div>
    <Modal v-model="sortShow" width="1000">
        <p slot="header" style="text-align:center">
            <span>历史记录</span>
        </p>
        <div style="text-align:center">
          <Table :columns="sortColumns" :data="sortData" :no-data-text="noDataText2"></Table>
        </div>
        <div slot="footer" >
					<div style="display: flex; justify-content: center;">
          <Page :total="historyTotal" :page-size="10" @on-change="sortTable" :current.sync="historyCurrent" ></Page>
        </div>
				</div>
    </Modal>
		
  </div>
</template>

<script>
	import uploadExcel from './uploadExcel'
  export default {
    name: "clientManagement",
		components: {
			uploadExcel,
		},
    data() {
      return {
        sortShow: false,
        sortData: [],
        sortName: '',
        sortColumns: [
            {
                title: '日期',
                key: 'created_at'
            },
            {
                title: '状态',
                key: 'state'
            },
            {
              title: '项目名',
              render: (h, params) => {
                return h('div', params.row.project.name);
              }
            },
            {
              title: '房源',
              render: (h, params) => {
                return h('div', params.row.house.house_num);
              }
            },
            {
                title: '备注',
                key: 'desc'
            }
        ],
        columns: [
            {
                title: 'ID',
                key: 'id'
            },
            {
                title: '客户姓名',
                key: 'name'
            },
            {
                title: '联系方式',
                key: 'phone'
            },
            {
              title: '市/区',
                key: 'action',
                width: 150,
                align: 'center',
                render: (h, params) => {
                  return h('div', params.row.city + (params.row.district?'/' + params.row.district:''));
                }
            },
            {
                title: '创建时间',
                key: 'created_at'
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
                                    this.customer_id = params.row.id
                                    this.sortTable(1)
                                }
                            }
                        }, '历史记录')
                    ]);
                }
            }
        ],
        data: [],
        clientName: '',
        historyCurrent: 1,
        historyTotal: 0,
        total: 0,
        pageSize: 10,
        current: 1,
        project_id: this.$route.params.id,
        customer_id: 0,
        noDataText1:'暂无数据',
        noDataText2:'暂无数据',
				isUploadExcel: false,
      }
    },
    methods: {
			cancelUpload(){
				this.isUploadExcel = false;
			},
			gotoUploadExcel(){
				this.isUploadExcel = true;
			},
      sortTable(data) {
        this.historyCurrent = data
        this.$post('/customer/customerHistory', {
          id: this.customer_id,
          page: data
        }).then(res => {
          if (res.data === '没有权限') {
            this.noDataText2 = '没有权限'
            return false
          }
          this.historyTotal = res.data.count
          this.sortData = res.data.customerHistory
          this.sortShow = true
        })
      },
      getData(page) {
        this.current = page
        this.$post('/customer/lists',{
          project_id: this.project_id,
          page: this.current,
          name: this.clientName
        }).then(res => {
          if (res.data === '没有权限') {
            this.noDataText1 = '没有权限'
            return false
          }
          this.total = res.data.count
          this.data = res.data.customer
        })
      },
      ClientView(data) {
        let uid = data.id
        data.id = this.project_id
        data.uid = uid
        this.$router.push({
          name: 'clientView',
          params: data
        })
      },
      ClientEdit(data) {
        let uid = data.id
        data.id = this.project_id
        data.uid = uid
        this.$router.push({
          name: 'clientEdit',
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
	padding-top: 20px;
  .search-item {
    &__label {
     line-height: 32px;
     text-align: center; 
		 
    }
  }
}
.project-container {
  // padding: 20px 30px 50px;
}
.client-content {
  margin: 20px 0;
	padding: 0 30px;
}
.operation-panel {
  margin-top: 20px;
	padding: 0 30px;
}
.modal_wrap {
	z-index: 1000;
			position: absolute;
			// top:0;
			margin: 0;
			width: 86.5%;
			height: 80%;
			background-color: rgba(0, 0, 0, .5);
			display: flex;
			justify-content: center;
			align-items: center;
		}
</style>
