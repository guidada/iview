<template>
  <div class="project-container">
    <div class="search-panel">
      <div class="search-itme">
        <Row :gutter="24">
          <Col span="4">
            <Input v-model="name" placeholder="事项名称"></Input>
          </Col>
          <Col span="8">
            <Input v-model="desc" placeholder="收费标准表述"></Input>
          </Col>
          <Col span="4">
            <div style="line-height: 32px;">
                <Checkbox v-model="required" >必填</Checkbox>
            </div>
          </Col>
          <Col span="8">
            <div v-if="isEdit" class="edit">
                <Button type="primary" @click="add">保存</Button>
                <Button type="default" @click="isEdit = false">返回</Button>
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
                title: '收费标准描述',
                key: 'desc'
            },
            {
              title: '是否必填',
                key: 'house',
                width: 150,
                align: 'center',
                render: (h, params) => {
                  return h('div', params.row.is_main?'是':'否');
                }
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
        desc: '',
        required: false,
        isEdit: false,
        editId: ''
      }  
    },
    methods: {
      getData(page) {
        this.$post('/config/projectReachConfigLists',{
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
          this.data = res.data.reachConfig
        })
      },
      edit(data) {
        this.name = data.name
        this.desc = data.desc
        this.required = Boolean(data.is_main)
        this.editId = data.id
        this.isEdit = true
      },
      back() {
        this.name = ''
        this.isEdit = false
        this.editId = ''
        this.desc = ''
        this.required = false
        this.isEdit = false
      },
      add() {
        if(this.isEdit) {
            //编辑状态
            this.$post('/config/updateProjectReachConfig',{
              project_id: this.project_id,
              id: this.editId,
              name: this.name,
              desc: this.desc,
              is_main: this.required? 1:0
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
            this.$post('/config/addProjectReachConfig',{
              project_id: this.project_id,
              name: this.name,
              desc: this.desc,
              is_main: this.required? 1:0
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
        this.$post('/config/deleteProjectReachConfig',{
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
