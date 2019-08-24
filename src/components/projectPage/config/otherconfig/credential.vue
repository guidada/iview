<template>
  <div class="project-container">
    <div class="search-panel">
      <div class="search-itme">
        <Row :gutter="24">
          <Col span="4">
            <Input v-model="name" placeholder="事项名称"></Input>
          </Col>
          <Col span="8">
            <div v-if="isEdit" class="edit">
                <Button type="primary" @click="add">保存</Button>
                <Button type="default" @click="back">返回</Button>
            </div>
            <div v-else class="add">
                <Button type="primary" @click="add">添加</Button>
            </div>
          </Col>
        </Row>
      </div>
      <div class="client-content">
        <Table border :columns="columns" :data="data"></Table>
      </div>
      <Page :total="total" :page-size="pageSize" @on-change="getData" :current.sync="current"></Page>
    </div>
  </div>
</template>

<script>
  export default {
    name: "contractList",
    data() {
      return {
        columns: [
            {
                title: '事项名称',
                key: 'name'
            },
            {
                title: '操作',
                key: 'action',
                width: 150,
                align: 'center',
                render: (h, params) => {
                    return h('div', [
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
                                    this.edit(params.row)
                                }
                            }
                        }, '编辑'),
                        h('Button', {
                            props: {
                                type: 'text',
                                size: 'small'
                            },
                            style: {
                              color: '#ed4014'
                            },
                            on: {
                                click: () => {
                                    this.delete(params.row)
                                }
                            }
                        }, '删除')
                    ]);
                }
            }
        ],
        data: [],
        total: 0,
        pageSize: 10,
        current: 1,
        project_id: this.$route.params.id,
        name: '',
        isEdit: false,
        editId: ''
      }  
    },
    methods: {
      back() {
        this.name = ''
        this.isEdit = false
        this.editId = ''
        this.isEdit = false
      },
      getData(page) {
        this.$post('/config/projectSetConfigLists',{
          project_id: this.project_id,
          page: this.current
        }).then(res => {
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          this.total = res.data.count
          this.data = res.data.setConfig
        })
      },
      edit(data) {
        this.name = data.name
        this.editId = data.id
        this.isEdit = true
      },
      add() {
        if(this.isEdit) {
            //编辑状态
            this.$post('/config/updateProjectSetConfig',{
              project_id: this.project_id,
              id: this.editId,
              name: this.name,
            }).then(res => {
              if (res.data === '没有权限') {
                this.$Modal.error({
                  title: '警告',
                  content: '没有权限'
                })
                return false
              }
              this.$Message.success('编辑成功')
              this.getData(1)
            })
        }else {
            //新增状态
            this.$post('/config/addProjectSetConfig',{
              project_id: this.project_id,
              name: this.name
            }).then(res => {
              if (res.data === '没有权限') {
                this.$Modal.error({
                  title: '警告',
                  content: '没有权限'
                })
                return false
              }
              this.$Message.success('添加成功')
              this.getData(1)
            })
        }
        this.back()
      },
      delete(data) {
        this.$post('/config/deleteProjectSetConfig',{
          id: data.id
        }).then(res => {
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          this.$Message.success('删除成功')
          this.getData(1)
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
