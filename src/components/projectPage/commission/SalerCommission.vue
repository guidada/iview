<template>
  <div class="xiao_shou_commission_container">
    <h2>{{currentTime}}月--案场基础佣金汇总表</h2>
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
    </Row>
    <!-- 表单-->
    <div class="table_wrap">
      <Table
        :columns="columns"
        :data="xiaoShouCommissionList"
        :no-data-text="noDataText"
        border></Table>
    </div>
    <!-- 查看明细-->
    <Modal
      v-model="isShowSalerCommissionMingXi"
      title="明细"
      width="1150"
    >
      <h4 style="font-size: 14px;font-weight: bold;margin-bottom: 10px;line-height: 35px;">
        <span style="padding: 0 30px">置业顾问：<span style="color: #348EED">{{guWenName}}</span></span>
        <span>结佣月份：{{currentTime}}</span>
      </h4>
      <SalerCommissionMingXi
        :mingXiList="mingXiList"
      ></SalerCommissionMingXi>
    </Modal>
    <!-- 分页器-->
    <div class="page_wrap">
      <Page :total="total" :page-size="pageSize" :value="currentPage" @on-change="pageChange"></Page>
    </div>
  </div>
</template>

<script>
  import SalerCommissionMingXi from './SalerCommission/SalerCommissionMingXi'

  export default {
    name: "SalerCommission",
    components: {
      SalerCommissionMingXi,
    },
    data() {
      return {
        // 是否查看明细
        isShowSalerCommissionMingXi: false,
        currentFilterTime: '',
        currentTime: '',
        disabledate: {
          disabledDate(date) {
            return date && date.valueOf() > Date.now()
          }
        },
        // 销售的佣金总列表
        xiaoShouCommissionList: [{index: 1}],
        //结佣月份,置业顾问,住宅佣金,商铺佣金,车位佣金,主管佣金,经理佣金,当前月佣金小计
        columns: [
          {title: '结佣月份', key: 'month', align: 'center'},
          {title: '置业顾问', key: 'name', align: 'center'},
          {title: '住宅佣金', key: 'house_price', align: 'center',},
          {title: '商铺佣金', key: 'shop_price', align: 'center',},
          {title: '车位佣金', key: 'car_price', align: 'center',},
          {title: '主管佣金', key: 'zg_price', align: 'center',},
          {title: '经理佣金', key: 'jl_price', align: 'center',},
          {title: '当前月佣金小计', key: 'total_price', align: 'center',},
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
                      this.gotoViewMingXi(params.row)
                    }
                  }
                }, '明细')
              ])
            }
          }
        ],
        pageSize: 10,
        total: 50,
        currentPage: 1,
        // 明细列表
        mingXiList: [],
        guWenName: '',
        noDataText:'暂无数据'
      }
    },
    created() {
      this.currentFilterTime = this.formatTime(new Date())
      this.currentTime = this.formatTime(new Date())
      this.getXiaoShouCommissionList(this.currentTime)
    },
    methods: {
      /*
      * 切换筛选时间
      * */
      changeFilterTime(res) {
        this.currentTime = this.formatTime(new Date(res))
        this.getXiaoShouCommissionList(this.currentTime)
      },
      /*
      *   根据月份获取到销售的佣金汇总表
      * */
      getXiaoShouCommissionList(time, page) {
        this.$post('/commission/peopleCommissionMonth', {
          project_id: parseInt(this.$route.params.id),
          time: time,
          page: page || 1
        }).then(res => {
          // console.log('案场基础佣金汇总表', res)
          if (res.data === '没有权限') {
            this.noDataText = '没有权限'
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('获取' + time + '案场基础佣金汇总表失败！')
          this.$Message.success('获取' + time + '案场基础佣金汇总表成功！')
          var result = res.data.commission
          var list = []
          result.forEach((item, index) => {
            list.push({
              index: index + 1,
              month: time,
              id: item.id,
              name: item.name,
              house_price: item.house_price,
              car_price: item.car_price,
              zg_price: item.zg_price,
              jl_price: item.jl_price,
              shop_price: item.shop_price,
              total_price: parseFloat(item.house_price) + parseFloat(item.car_price) + parseFloat(item.zg_price) + parseFloat(item.jl_price) + parseFloat(item.shop_price)
            })
          })
          this.xiaoShouCommissionList = list
          this.total = res.data.count

        }).catch(err => {
          this.$Message.error('获取' + time + '案场基础佣金汇总表失败！')
          console.log(err)
        })
      },
      /*
      * 时间格式化
      * */
      formatTime(t) {
        return t.getFullYear() + '-' + this.formatNum(t.getMonth() + 1)
      },
      formatTime2(t) {
        return t.getFullYear() + '-' + this.formatNum(t.getMonth() + 1) + '-' + this.formatNum(t.getDate())
      },
      /*
      * 个位数字自动加 ‘0’
      * */
      formatNum(d) {
        return d >= 10 ? d : '0' + d
      },
      /*
      *  去查看明细
      * */
      gotoViewMingXi(res) {
        this.isShowSalerCommissionMingXi = true
        this.guWenName = res.name
        // console.log('去查看明细', res)
        this.$post('/commission/peopleCommissionHistory', {
          project_id: parseInt(this.$route.params.id),
          id: res.id,
          time: res.month,
        }).then(res => {
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('获取明细失败！')
          this.$Message.success('获取明细成功！')
          var result = res.data.history
          // console.log(result)
          var list = []
          result.forEach((item, index) => {
            var received_payment_table = []
            var received_price = '/'
            var received_time = '/'
            if (item.received_payment_table) {
              item.received_payment_table.forEach(item=>{
                item.received_time = this.formatTime2(new Date(item.received_time))
              })
              received_payment_table = item.received_payment_table
              received_price = received_payment_table[0].received_price
              received_time = this.formatTime2(new Date(received_payment_table[0].received_time))
            }
            list.push({
              index: index + 1,
              house_num: item.house_num,
              customer_name: item.customer_name,
              sign_price: item.sign_price,
              subscribe_price: item.subscribe_price,
              subscribe_time: this.formatTime2(new Date(item.subscribe_time)),
              down_payment: item.down_payment,
              down_payment_time: this.formatTime2(new Date(item.down_payment_time)),
              received_price: received_price,
              received_time: received_time,
              received_payment_table: item.received_payment_table,
              commission_price: item.commission_price,
            })
          })
          this.mingXiList = list
        }).catch(err => {
          this.$Message.error('获取明细失败！')
          console.log(err)
        })
      },
      /*
      *  页面切换
      * */
      pageChange(page) {
        this.currentPage = page
        this.getXiaoShouCommissionList(this.currentTime, page)
      }
    }
  }
</script>

<style lang="less" scoped>
  .xiao_shou_commission_container {
    padding: 30px;

    h2 {
      text-align: center;
      line-height: 35px;
      margin-bottom: 10px;
    }
    .table_wrap {
      margin-top: 30px;
    }

    .page_wrap {
      margin-top: 30px;
      display: flex;
      justify-content: center;
    }
  }
</style>
