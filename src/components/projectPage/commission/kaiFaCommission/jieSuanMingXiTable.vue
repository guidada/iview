<template>
  <div class="jie_suan_ming_xi_commission_container">
    <Row>
      <Col span="12">
        <DatePicker
          type="month"
          style="width: 200px"
          v-model="filterTime"
          @on-change="changeFilterTime"
          :options="disabledate"
        ></DatePicker>
      </Col>
    </Row>
    <div class="table_wrap">
      <Table :columns="columns" :data="mingXiList" :no-data-text="noDataText" border></Table>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        // 筛选用的时间列表
        timeList: ['2019年5月', '2019年4月'],
        disabledate: {
          disabledDate(date) {
            return date && date.valueOf() > Date.now()
          }
        },
        // 筛选的时间 this.formatTime(new Date())
        filterTime: new Date(),
        mingXiList: [],
        columns: [
          {
            align: 'center',
            renderHeader: (h, params) => {
              return h('div', [
                h('span', {
                  props: {}
                }, this.formatTime(this.filterTime) + '--佣金结算明细'),
              ])
            },
            children: [
              {
                title: '类别',
                key: 'type',
                align: 'center',
                width: 80,
              },
              {
                title: '未回款佣金明细',
                align: 'center',
                children: [
                  {
                    title: '未回款金额',
                    key: 'un_back_price',
                    align: 'center',
                  },
                  {
                    title: '佣金率',
                    key: 'ratio',
                    align: 'center',
                  },
                  {
                    title: '结佣比例',
                    key: 'commission',
                    align: 'center',
                  },
                  {
                    title: '未回款佣金',
                    key: 'un_commission_price',
                    align: 'center',
                  }
                ]
              },
              {
                title: '可结佣明细',
                align: 'center',
                children: [
                  {
                    title: '可结佣基数',
                    key: 'back_price',
                    align: 'center',
                  },
                  {
                    title: '佣金率',
                    key: 'ratio',
                    align: 'center',
                  },
                  {
                    title: '结佣比例',
                    key: 'commission',
                    align: 'center',
                  },
                  {
                    title: '可结佣佣金额',
                    key: 'commission_price',
                    align: 'center',
                  }
                ]
              }
            ]
          },
        ],
        noDataText:'暂无数据'
      }
    },
    created() {
      this.getMingXiByTime('2019-05')
    },
    methods: {
      /*
      *  切换筛选时间，获取到指定时间的佣金明细
      * */
      changeFilterTime(res) {
        this.getMingXiByTime(res)
      },
      /*
      *  获取到指定月份的佣金明细
      * */
      getMingXiByTime(time) {
        this.$post('/commission/commissionMonth', {
          project_id: parseInt(this.$route.params.id),
          time: time
        }).then(res => {
          if (res.data === '没有权限') {
            this.noDataText = '没有权限'
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('获取明细失败！')
          var result = res.data
          this.mingXiList = [
            {
              type: '住宅',
              back_price: result.commission_house.back_price,
              un_back_price: result.commission_house.un_back_price,
              ratio: result.commission_house.ratio,
              commission: result.commission_house.commission,
              uncommission: result.commission_house.uncommission,
              commission_price: result.commission_house.commission_price,
              un_commission_price: result.commission_house.un_commission_price,
            },
            {
              type: '商铺',
              back_price: result.commission_shop.back_price,
              un_back_price: result.commission_shop.un_back_price,
              ratio: result.commission_shop.ratio,
              commission: result.commission_shop.commission,
              uncommission: result.commission_shop.uncommission,
              commission_price: result.commission_shop.commission_price,
              un_commission_price: result.commission_shop.un_commission_price,
            },
            {
              type: '车位',
              back_price: result.commission_car.back_price,
              un_back_price: result.commission_car.un_back_price,
              ratio: result.commission_car.ratio,
              commission: result.commission_car.commission,
              uncommission: result.commission_car.uncommission,
              commission_price: result.commission_car.commission_price,
              un_commission_price: result.commission_car.un_commission_price,
            },
            {
              type: '合计',
              back_price: parseFloat(result.commission_car.back_price) + parseFloat(result.commission_house.back_price) + parseFloat(result.commission_shop.back_price),
              un_back_price: parseFloat(result.commission_car.un_back_price) + parseFloat(result.commission_house.un_back_price) + parseFloat(result.commission_shop.un_back_price),
              ratio: '-',
              commission:'-',
              uncommission: '-',
              commission_price: parseFloat(result.commission_car.commission_price) + parseFloat(result.commission_house.commission_price) + parseFloat(result.commission_shop.commission_price),
              un_commission_price: parseFloat(result.commission_car.un_commission_price) + parseFloat(result.commission_house.un_commission_price) + parseFloat(result.commission_shop.un_commission_price),
            }
          ]
          // console.log(' this.mingXiList============', this.mingXiList)
        }).catch(err => {
          this.$Message.error('获取明细失败！')
          console.log(err)
        })
      },
      /*
    * 时间格式化
    * */
      formatTime(t) {
        return t.getFullYear() + '年' + (t.getMonth() + 1) + '月'
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

<style lang="less">
  .jie_suan_ming_xi_commission_container {

    .table_wrap {
      margin-top: 30px;
    }

  }

</style>
