<template>
  <Card v-if="isViewCancelRaise">
    <viewCancelraise
      @cancelView="cancelView"
      :viewInfo="viewInfo"
      :projectInfo="projectInfo"
    ></viewCancelraise>
  </Card>
  <div v-else class="my_chaosong_container">
    <!-- 筛选-->
    <Form :label-width="100">
      <div>
        <Row>
          <Col span="11">
            <FormItem label="销控单筛选：" prop="house_id">
              <div style="display: flex;justify-content: flex-start;">
                <Input placeholder="请输入销控单ID" v-model="follow_id" style="width: 150px"></Input>
                <Button @click="getfollowInfo" type="primary" style="margin-left: 10px">筛选</Button>
              </div>
            </FormItem>
          </Col>
          <Col span="6" offset="1">
            <Select
              v-model="filterState"
              style="width:200px"
              @on-change="filterByState"
              placeholder="通过状态筛选优惠单"
            >
              <Option
                v-for="(item,index) in stateList"
                :value="item.title"
                :key="item.index"
              >{{ item.title }}
              </Option>
            </Select>
          </Col>
        </Row>
      </div>
    </Form>
    <!-- 销控列表-->
    <div class="table_wrap">
      <Table border :columns="columns" :data="myChaoSongList" :no-data-text="noDataText"></Table>
    </div>
    <!-- 分页器-->
    <div class="page_wrap">
      <Page :total="total" :page-size="pageSize" @on-change="pageChange"></Page>
    </div>
  </div>
</template>

<script>
  import viewCancelraise from './edit'

  let Base64 = require('js-base64').Base64
  export default {
    name: "myChaoSong",
    components: {
      viewCancelraise
    },
    data() {
      return {
        follow_id: null,
        // 筛选状态
        filterState: null,
        // 状态列表
        stateList: [
          {title: '取消筛选'},
          {title: '审核中'},
          {title: '已通过'},
          {title: '驳回'},
          {title: '已取消'}
        ],
        columns: [
          {
            title: '取消销控单号',
            key: 'number',
            width: 160,
            align: 'center',
          },
          {
            title: '关联项目',
            key: 'project_name',
            align: 'center',
          },
          {
            title: '关联房号',
            key: 'room_num',
            align: 'center',
          },
          {
            title: '审批状态',
            key: 'action',
            // width: 150,
            align: 'center',
            render: (h, params) => {
              if (params.row.state === '审核中') {
                return h('div', {
                  style: {
                    color: 'blue',
                  }
                }, params.row.state)
              } else if (params.row.state === '已通过') {
                return h('div', {
                  style: {
                    color: 'green',
                  }
                }, params.row.state)
              } else if (params.row.state === '驳回') {
                return h('div', {
                  style: {
                    color: 'red',
                  }
                }, params.row.state)
              } else {
                return h('div', {
                  style: {
                    color: 'gray',
                  }
                }, params.row.state)
              }

            }
          },
          {
            title: '创建者',
            key: 'worker_name',
            align: 'center',
          },
          {
            title: '创建时间',
            key: 'created_at',
            align: 'center',
          },
          {
            title: '操作',
            key: 'action',
            width: 80,
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
                      this.gotoViewForm(params.row.id)
                    }
                  }
                }, '查看')
              ])
            }
          }
        ],
        // 我创建的销控列表（处理过的）
        myChaoSongList: [],
        // 我创建的销控列表（未处理的原始数据，用于查看时数据渲染）
        quxiaoList: [],
        total: 0,
        pageSize: 10,
        // 当前选中要查看的数据
        viewInfo: {},
        // 是否查看优惠单
        isViewCancelRaise: false,
        project_id: this.$route.params.id,
        noDataText: '暂无数据',
      }
    },
    props: ['currentTap', 'projectInfo'],
    created() {

    },
    methods: {
      getfollowInfo() {
        this.getCancelSalesListByTap(this.currentTap)
      },
      /*
      *  获取到所有的销控列表
      * */
      getCancelSalesListByTap(tap, page) {
        this.$post('/quxiao/lists', {
          project_id: this.project_id,
          page: page || 1,
          type: tap,
          state: this.filterState,
          follow_id: this.follow_id
        }).then(res => {
          if (res.data === '没有权限') {
            this.noDataText = '没有权限'
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('获取销控列表失败！')
          var quxiao = res.data.quxiao
          var result = []
          quxiao.forEach(item => {
            result.push({
              id: item.id,
              number: item.number,
              project_name: this.projectInfo.name,
              room_num: item.house.house_num,
              state: item.state,
              worker_name: Base64.decode(item.worker.name) + '/' + item.worker.job,
              created_at: this.formatTime(new Date(item.created_at.date)),
            })
          })
          this.myChaoSongList = result
          this.quxiaoList = quxiao
          this.total = res.data.count
        }).catch(err => {
          this.$Message.error('获取销控列表失败！')
          console.log(err)
        })
      },
      /*
     * 查看销控
     * */
      gotoViewForm(id) {
        this.isViewCancelRaise = true
        this.viewInfo = this.quxiaoList.find(item => {
          return item.id === id
        })
      },
      /*
     * 取消查看优惠单
     * */
      cancelView() {
        this.isViewCancelRaise = false
      },
      /*
      *  页面切换的处理
      * */
      pageChange(page) {
        this.getCancelSalesListByTap(this.currentTap, page)
      },
      /*
       *  通过状态筛选获取到指定的优惠单列表
       * */
      filterByState(state) {
        // console.log('要筛选的标签', state, this.filterState)
        if (state === '取消筛选') {
          this.filterState = null
          this.follow_id = null
        }
        this.getCancelSalesListByTap(this.currentTap)
      },
      /*
      * 时间格式化
      * */
      formatTime(t) {
        return t.getFullYear() + '-' + this.formatNum(t.getMonth() + 1) + '-' + this.formatNum(t.getDate())
      },
      /*
      * 个位数字自动加 ‘0’
      * */
      formatNum(d) {
        return d >= 10 ? d : '0' + d
      },
    }
  }
</script>

<style lang="less" scoped>
  .my_chaosong_container {
    padding: 30px;
    width: 100%;
    height: 800px;

    .table_wrap {
      margin: 20px 0;
    }

    .btn_wrap {
      margin-top: 20px;
    }

    .page_wrap {
      margin-top: 30px;
      display: flex;
      justify-content: center;
    }
  }
</style>
