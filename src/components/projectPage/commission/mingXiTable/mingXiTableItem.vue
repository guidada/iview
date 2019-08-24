<template>
  <div class="ming_xi_table_item_container">
    <!--<Spin size="large" fix v-if="spinShow"></Spin>-->
    <!-- 筛选-->
    <Row>
      <Col span="12">
        <DatePicker
          type="month"
          style="width: 200px"
          v-model="currentFilterTime"
          @on-change="changeFilterTime"
          :options="disabledate"
        ></DatePicker>
      </Col>
      <Col span="12">
        <div style="display: flex;justify-content: flex-end;">
          <Button
            @click="cancelView"
          >
            返回年度报表
          </Button>
        </div>
      </Col>
    </Row>
    <!-- 表单-->
    <Row>
      <Col>
        <h2 class="table_header">{{currentTime}}/{{currentSubTap}}明细</h2>
        <div class="btn_wrap">
          <Button
            type="primary"
            @click="exportData"
          >导出
          </Button>
        </div>
        <div class="table_wrap">
          <Table
            width="2000"
            ref="mingXiTable"
            :columns="columns"
            :data="mingXiList"
            :no-data-text="noDataText"
            border></Table>
        </div>
      </Col>
    </Row>
    <!--房源结佣历史-->
    <Modal
      v-model="isShowHistory"
      title="房源结佣历史"
      width="1000px"
    >
      <historyForm
        :historyList="historyList"
        :historyInfo="historyInfo"
      ></historyForm>
    </Modal>
    <!--回款记录-->
    <Modal
      v-model="isShowHuiKuanList"
      title="回款记录"
    >
      <huikuanHistory
        :huiKuanList="huiKuanList"
      ></huikuanHistory>
    </Modal>
    <!-- 分页器-->
    <div class="page_wrap">
      <Page :total="total" :page-size="pageSize" v-model="currentPage" @on-change="pageChange"></Page>
    </div>
  </div>
</template>

<script>
  import historyForm from './history'
  import huikuanHistory from './huikuanHistory'

  export default {
    name: "mingXiTableItem",
    components: {
      historyForm,
      huikuanHistory,
    },
    data() {
      return {
        currentFilterTime: '',
        currentTime: '',
        disabledate: {
          disabledDate(date) {
            return date && date.valueOf() > Date.now()
          }
        },
        // 明细列表（根据标签不同，分别获取到住宅、商铺和车位的明细）
        mingXiList: [],
        //序号，楼栋房号，客户姓名，签约方式，签约价格，认购金，认购日期，首付金额，首付日期，放款金额，放款日期，置业顾问，剩余未回款
        columns: [
          {title: '序号', key: 'index', align: 'center', width: 60},
          {title: '楼栋房号', key: 'house_num', align: 'center', width: 100},
          {title: '客户姓名', key: 'customer_name', align: 'center',},
          {title: '签约方式', key: 'payment', align: 'center',},
          {title: '签约价格', key: 'sign_price', align: 'center',},
          {title: '认购金', key: 'subscribe_price', align: 'center',},
          {title: '认购日期', key: 'subscribe_time', align: 'center',},
          {title: '首付金额', key: 'down_payment', align: 'center',},
          {title: '首付日期', key: 'down_payment_time', align: 'center',},
          {
            title: '放款金额',
            // key: 'recived_price',
            align: 'center',
            render: (h, param) => {
              return h('div', [
                h('span', {
                  props: {
                    trigger: "hover",
                    title: "放款记录",
                    placement: "right-start"
                  },
                  style: {
                    cursor: 'pointer',
                    color: '#348EED'
                  },
                  on: {
                    click: () => {
                      this.getFangKuanList(param.row)
                    }
                  }
                }, param.row.recived_price)
              ])
            }
          },
          {title: '放款日期', key: 'received_payment_time', align: 'center',},
          {title: '置业顾问', key: 'worker_name', align: 'center',},
          {title: '剩余未回款', key: 'un_commission_price', align: 'center',},
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  style: {
                    color: '#348EED',
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      this.gotoViewMingXiHistory(params.row)
                    }
                  }
                }, '结佣历史')
              ])
            }
          }
        ],
        spinShow: false,
        // 是否展示历史记录
        isShowHistory: false,
        // 当前查看的历史记录
        historyList: [{index: 1}, {index: 2},],
        // 历史记录基础信息配置
        historyInfo: {},
        // 是否展示回款记录
        isShowHuiKuanList: false,
        // 当前查看的回款记录
        huiKuanList: [{index: 1}],
        pageSize: 10,
        total: 10,
        currentPage: 1,
        noDataText: '暂无数据',
      }
    },
    props: ['filterTime', 'currentSubTap'],
    created() {
      this.currentFilterTime = this.filterTime
      this.currentTime = this.filterTime
      this.getMingXiListByTimeAndTap(this.currentTime, this.currentSubTap)
    },
    methods: {
      cancelView() {
        this.$emit('cancelView')
      },
      /*
      *  修改筛选时间
      * */
      changeFilterTime(t) {
        this.currentTime = t
        this.getMingXiListByTimeAndTap(t, this.currentSubTap)
        var info = {
          time: t,
          tap: this.currentSubTap
        }
        this.$emit('changeFilterTime', info)
      },
      /*
      *  获取到明细列表
      * */
      getMingXiListByTimeAndTap(time, tap, page) {
        this.spinShow = true
        this.$post('/commission/commissionLists', {
          project_id: parseInt(this.$route.params.id),
          time: time,
          type: tap,
          page: page || 1,
        }).then(res => {
          // console.log('获取' + tap + '年度明细成功！', res)
          if (res.data === '没有权限') {
            this.noDataText = '没有权限'
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('获取' + tap + '明细失败！')
          this.$Message.success('获取' + time + '月' + tap + '明细成功！')
          this.spinShow = false
          var result = res.data.commission
          // var common_title = res.data.common_title
          var MingXiList = []
          result.forEach((item, index) => {
            var received_time = '/'
            var received_price = '/'
            var received_payment_table = []
            if (item.received_payment_table) {
              received_time = this.formatTime(new Date(item.received_payment_table[0].received_time))
              received_price = item.received_payment_table[0].received_price
              received_payment_table = item.received_payment_table
            }
            MingXiList.push({
              index: index + 1,
              house_num: item.house_num,
              customer_name: item.customer_name,
              payment: item.payment,
              sign_price: item.sign_price,
              subscribe_price: item.subscribe_price,
              subscribe_time: this.formatTime(new Date(item.subscribe_time)),
              down_payment: item.down_payment,
              down_payment_time: this.formatTime(new Date(item.down_payment_time)),
              // down_payment_time: item.down_payment_time.substr(0,11),
              recived_price: received_price,
              received_payment_time: received_time,
              worker_name: item.worker_name,
              un_commission_price: item.un_commission_price,
              commission: item.commission,
              received_payment_table: received_payment_table,
            })
          })
          // this.commissionConfig = res.data.config || {}
          this.historyInfo = {
            ratio: res.data.config.ratio,
            commission: res.data.config.commission,
          }
          this.mingXiList = MingXiList
          this.total = res.data.count
        }).catch(err => {
          this.$Message.error('获取' + tap + '明细失败！')
          console.log(err)
        })
      },
      /*
      *  查看结佣历史
      * */
      gotoViewMingXiHistory(row) {
        // console.log('row========================', row)
        var historyInfo = this.historyInfo
        historyInfo.un_commission_price = row.un_commission_price
        historyInfo.total_commission_price = row.sign_price * historyInfo.ratio / 100
        historyInfo.sign_price = row.sign_price
        var result = []

        row.commission.forEach((item, index) => {
          result.push({
            index: '第' + (index + 1) + '次',
            back_month: item.back_time.substr(0, 7),
            price: item.price,
            ratio: historyInfo.ratio + '%',
            commission: historyInfo.commission + '%',
            commission_price: item.price * historyInfo.ratio * historyInfo.commission / 10000,
          })
        })
        this.historyList = result
        this.historyInfo = historyInfo
        this.isShowHistory = true
        // console.log('查看结佣历史的基本配置===', this.historyInfo)
      },
      /*
     * 时间格式化
     * */
      formatTime(t) {
        return t.getFullYear() + '年' + this.formatNum(t.getMonth() + 1) + '月' + this.formatNum(t.getDate())+ '日'
      },
      /*
      * 个位数字自动加 ‘0’
      * */
      formatNum(d) {
        return d >= 10 ? d : '0' + d
      },
      exportData() {
        this.$refs.mingXiTable.exportCsv({
          filename: '年度住宅佣金结算明细'
        })
      },
      /*
      *  获取到放款信息
      * */
      getFangKuanList(row) {
        this.isShowHuiKuanList = true
        var list = []
        row.received_payment_table.forEach((item, index) => {
          list.push({
            index: index + 1,
            price: item.received_price,
            time: item.received_time.substr(0, 10),
          })
        })
        this.huiKuanList = list
        // console.log('获取到放款信息', row)
      },
      /*
      *  页面切换
      * */
      pageChange(page) {
        this.currentPage = page
        // console.log(this.currentPage)
        this.getMingXiListByTimeAndTap(this.currentTime, this.currentSubTap, page)
      }
    }
  }
</script>

<style lang="less" scoped>
  .ming_xi_table_item_container {

    .table_wrap {
      width: 100%;
      overflow-x: scroll;
    }

    .table_header {
      text-align: center;
      line-height: 35px;
    }

    .btn_wrap {
      display: flex;
      justify-content: flex-end;
      padding: 0 30px;
      margin-bottom: 15px;
    }

    .page_wrap {
      margin-top: 30px;
      display: flex;
      justify-content: center;
    }
  }
</style>
