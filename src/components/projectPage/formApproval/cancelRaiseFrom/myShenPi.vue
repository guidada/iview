<template>
  <Card v-if="isViewCancelRaise">
    <viewCancelraise
      @cancelView="cancelView"
      @submitSuccess="submitSuccess"
      :viewInfo="viewInfo"
      :isShenPi="isShenPi"
    ></viewCancelraise>
  </Card>
  <div v-else class="my_shenpi_container">
    <!-- 筛选-->
    <Form :label-width="100">
      <div>
        <Row>
          <Col span="5">
            <FormItem label="房源筛选：" prop="house_id">
              <Select v-model="houseInfo.building" placeholder="楼栋" @on-change="getUnitList">
                <Option v-for="(item, index) in building" :value="item.id" :key="index">{{item.building_num}}幢</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="3" style="min-width: 100px">
            <FormItem :label-width="1">
              <Select v-model="houseInfo.unit" placeholder="单元" @on-change="getHouseList">
                <Option v-for="(item, index) in unit" :value="item.id" :key="index">{{item.unit_num}}单元</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="3" style="min-width: 100px">
            <FormItem :label-width="1">
              <Select v-model="houseInfo.house_id" placeholder="房源" @on-change="getHouseInfo">
                <Option v-for="(item, index) in house" :value="item.id" :key="index">{{item.room}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6" offset="1">
            <Select
              v-model="filterState"
              style="width:200px"
              @on-change="filterByState"
              placeholder="通过状态筛选解筹单"
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
    <!-- 解筹列表-->
    <div class="table_wrap">
      <Table border :columns="columns" :data="myShenpiList" :no-data-text="noDataText"></Table>
    </div>
    <!-- 分页器-->
    <div class="page_wrap">
      <Page :total="total" :page-size="pageSize" @on-change="pageChange"></Page>
    </div>
  </div>
</template>

<script>
  import viewCancelraise from './viewCancelraise'

  let Base64 = require('js-base64').Base64
  export default {
    name: "myShenPi",
    components: {
      viewCancelraise
    },
    data() {
      return {
        // 三级下拉框数据
        houseInfo: {
          building: null,
          unit: null,
          house_id: null,
        },
        // 楼栋列表
        building: [],
        building_id: null,
        // 单元列表
        unit: [],
        // 房源列表
        house: [],
        // 筛选房号
        filterRoomNum: '',
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
            title: '解筹单号',
            key: 'number',
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
                    size: 'small',
                    disabled: params.row.state !== '审核中'
                  },
                  style: {
                    marginRight: '5px',
                    color: params.row.state === '审核中' ? '#2d8cf0' : '#aaaaaa'
                  },
                  on: {
                    click: () => {
                      this.gotoViewForm(params.row.id)
                    }
                  }
                }, '审批')
              ])
            }
          }
        ],
        // 我创建的解筹列表（处理过的）
        myShenpiList: [],
        // 我创建的解筹列表（未处理的原始数据，用于查看时数据渲染）
        jiechouList: [],
        total: 0,
        pageSize: 10,
        // 当前选中要查看的数据
        viewInfo: {},
        // 是否查看解筹单
        isViewCancelRaise: false,
        // 是否编辑解筹单（只有在驳回的情况下有）
        isEditCancelRaise: false,
        project_id: this.$route.params.id,
        // 是否审批
        isShenPi: false,
        noDataText: '暂无数据',
      }
    },
    props: ['currentTap'],
    created() {
      this.getCancelRaiseListByTap(this.currentTap)
      this.getBuildingList(parseInt(this.$route.params.id))
    },
    methods: {
      /*
      *  获取到楼栋列表的基本配置
      * */
      getBuildingList(project_id) {
        this.$post('jiechou/jiechouConfig', {project_id: project_id}).then(res => {
          if (res.status_code !== 200) return this.$Message.error('获取房源失败！')
          this.building = res.data.building
        }).catch(err => {
          this.$Message.error('获取房源失败！')
        })
      },
      /*
      *  获取到当前选择的楼栋的单元信息
      * */
      getUnitList(building_id) {
        this.building_id = building_id
        var info = {
          project_id: parseInt(this.$route.params.id),
          building_id: building_id
        }
        this.$post('jiechou/jiechouConfig', info).then(res => {
          if (res.status_code !== 200) return this.$Message.error('获取房源失败！')
          this.houseInfo.unit = ''
          this.houseInfo.house_id = null
          this.unit = res.data.unit
        }).catch(err => {
          this.$Message.error('获取房源失败！')
          console.log(err)
        })
      },
      /*
      * 获取到当前选择的楼栋的指定单元的房源
      * */
      getHouseList(unit_id) {
        var info = {
          project_id: parseInt(this.$route.params.id),
          building_id: this.building_id,
          unit_id: unit_id,
        }
        this.$post('jiechou/jiechouConfig', info).then(res => {
          if (res.status_code !== 200) return this.$Message.error('获取房源失败！')
          this.houseInfo.house_id = null
          this.house = res.data.all_house
          // console.log('房源的基本信息===', this.house)
        }).catch(err => {
          this.$Message.error('获取房源失败！')
        })
      },
      /*
     *  通过房号筛选解筹单信息
     * */
      getHouseInfo(house_id) {
        // console.log(house_id,this.houseInfo.house_id)
        this.getCancelRaiseListByTap(this.currentTap)
      },
      /*
      * 通过标签获取到解筹列表
      * */
      getCancelRaiseListByTap(tap, page) {
        this.$post('/jiechou/lists', {
          project_id: this.project_id,
          page: page || 1,
          type: tap,
          state: this.filterState,
          house_id: this.houseInfo.house_id
        }).then(res => {
          if (res.data === '没有权限') {
            this.noDataText = '没有权限'
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('获取解筹列表失败！')
          var jiechou = res.data.jiechou
          var result = []
          jiechou.forEach(item => {
            result.push({
              id: item.id,
              number: item.number,
              project_name: item.project.name,
              room_num: item.house.house_num,
              state: item.state,
              worker_name: Base64.decode(item.worker.name) + '/' + item.worker.job,
              created_at: this.formatTime(new Date(item.created_at.date)),
            })
          })
          this.myShenpiList = result
          this.jiechouList = jiechou
          this.total = res.data.count
        }).catch(err => {
          this.$Message.error('获取解筹列表失败！')
          console.log(err)
        })
      },
      /*
     * 查看解筹
     * */
      gotoViewForm(id) {
        this.viewInfo = this.jiechouList.find(item => {
          return item.id === id
        })
        if (this.viewInfo.state !== '审核中') return this.$Message.error('不可审批！')
        this.isShenPi = true
        this.isViewCancelRaise = true
      },
      /*
     * 取消查看解筹单
     * */
      cancelView() {
        this.isViewCancelRaise = false
        this.isEditCancelRaise = false
      },
      /*
     * 审批完成后
     * */
      submitSuccess() {
        this.isViewCancelRaise = false
        this.isEditCancelRaise = false
        this.$emit('getShenPiCount')
        this.getCancelRaiseListByTap(this.currentTap)
      },
      /*
      *  页面切换的处理
      * */
      pageChange(page) {
        this.getCancelRaiseListByTap(this.currentTap, page)
      },
      /*
       *  通过状态筛选获取到指定的解筹单列表
       * */
      filterByState(state) {
        // console.log('要筛选的标签', state, this.filterState)
        if (state === '取消筛选') {
          this.filterState = null
          this.houseInfo= {
            building: null,
            unit: null,
            house_id: null,
          }
        }
        this.getCancelRaiseListByTap(this.currentTap)
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
  .my_shenpi_container {
    padding: 30px;
    width: 100%;
    height: 800px;

    .table_wrap {
      margin: 20px 0;
    }

    .page_wrap {
      margin-top: 30px;
      display: flex;
      justify-content: center;
    }
  }
</style>
