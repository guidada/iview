<template>
  <Card v-if="isViewFavorable">
    <viewFavorable
      @cancelView="cancelView"
      @submitSuccess="submitSuccess"
      :viewInfo="viewInfo"
      :isShenPi="isShenPi"
    ></viewFavorable>
  </Card>
  <div v-else class="my_shen_pi_container">
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
    <!-- 优惠单列表-->
    <div class="table_wrap">
      <Table border :columns="columns" :data="myCreateList" :no-data-text="noDataText"></Table>
    </div>
    <!-- 分页器-->
    <div class="page_wrap">
      <Page :total="total" :page-size="pageSize" @on-change="pageChange"></Page>
    </div>
  </div>
</template>

<script>
  import viewFavorable from './viewFavorable'

  let Base64 = require('js-base64').Base64
  export default {
    name: "myShenPi",
    components: {
      viewFavorable,
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
            title: '变更单号',
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
            title: '操作动作',
            key: 'type',
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
                }, '审批')
              ])
            }
          }
        ],
        // 我创建的优惠单列表（处理过的）
        myCreateList: [],
        // 我创建的优惠单列表（未处理的原始数据，用于查看时数据渲染）
        discountList: [],
        total: 0,
        pageSize: 10,
        // 当前选中要查看的数据
        viewInfo: {},
        // 是否查看优惠单
        isViewFavorable: false,
        // 是否审批优惠单
        isShenPi: false,
        project_id: this.$route.params.id,
        noDataText: '暂无数据',
      }
    },
    props: ['currentTap'],
    created() {
      this.cancelView()
      this.getFavorableListByTap(this.currentTap)
      this.getBuildingList(parseInt(this.$route.params.id))
    },
    methods: {
      /*
      *  获取到楼栋列表的基本配置
      * */
      getBuildingList(project_id) {
        this.$post('discount/discountListConfig', {project_id: project_id}).then(res => {
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
        this.$post('discount/discountListConfig', info).then(res => {
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
        this.$post('discount/discountListConfig', info).then(res => {
          if (res.status_code !== 200) return this.$Message.error('获取房源失败！')
          this.houseInfo.house_id = null
          this.house = res.data.all_house
          // console.log('房源的基本信息===', this.house)
        }).catch(err => {
          this.$Message.error('获取房源失败！')
        })
      },
      /*
     *  通过房号筛选优惠单信息
     * */
      getHouseInfo(house_id) {
        // console.log(house_id,this.houseInfo.house_id)
        this.getFavorableListByTap(this.currentTap)
      },
      /*
     * 通过标签名获取到标签内的优惠单列表数据
     * */
      getFavorableListByTap(tap, page) {
        this.$post('/change/lists', {
          project_id: parseInt(this.$route.params.id),
          type: tap,
          page: page || 1,
          state: this.filterState,
          house_id: this.houseInfo.house_id,
        }).then(res => {
          if (res.data === '没有权限') {
            this.noDataText = '没有权限'
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('获取优惠单列表失败！')
          var discount = res.data.people
          var result = []
          discount.forEach(item => {
            result.push({
              type: item.type,
              id: item.id,
              number: item.number,
              project_name: item.project.name,
              room_num: item.house.house_num,
              state: item.state,
              worker_name: Base64.decode(item.worker.name) + '/' + item.worker.job,
              created_at: this.formatTime(new Date(item.created_at.date)),
            })
          })
          this.myCreateList = result
          this.discountList = discount
          this.total = res.data.count
        }).catch(err => {
          this.$Message.error('获取优惠单列表失败！')
          console.log(err)
        })
      },
      /*
      * 审批优惠单
      * */
      gotoViewForm(id) {
        this.viewInfo = this.discountList.find(item => {
          return item.id === id
        })
        if (this.viewInfo.state !== '审核中') return this.$Message.error('不可审批！')
        this.isShenPi = true
        this.isViewFavorable = true
      },
      /*
      * 取消审批优惠单
      * */
      cancelView() {
        this.isViewFavorable = false
        this.isShenPi = false
      },
      /*
      * 审批完成后
      * */
      submitSuccess() {
        this.isViewFavorable = false
        this.isShenPi = false
        this.$emit('getShenPiCount')
        this.getFavorableListByTap(this.currentTap)
      },
      /*
      *  页面切换的处理
      * */
      pageChange(page) {
        this.getFavorableListByTap(this.currentTap, page)
      },
      /*
      *  通过状态筛选获取到指定的优惠单列表
      * */
      filterByState(state) {
        // console.log('要筛选的标签', state, this.filterState)
        if (state === '取消筛选') {
          this.filterState = null
        }
        this.getFavorableListByTap(this.currentTap)
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
  .my_shen_pi_container {
    padding: 30px;
    width: 100%;
    min-height: 800px;

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
