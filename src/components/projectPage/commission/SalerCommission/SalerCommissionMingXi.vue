<template>
  <div class="sales_commission_ming_xi_container">
    <Table
      :columns="columns"
      :data="mingXiList"
      border></Table>
  </div>
</template>

<script>
  export default {
    name: "SalerCommissionMingXi",
    data() {
      return {
        columns: [
          {title: '序号', key: 'index', align: 'center', width: 65},
          {title: '房号', key: 'house_num', align: 'center', width: 95},
          {title: '客户姓名', key: 'customer_name', align: 'center', width: 90},
          {title: '签约价格', key: 'sign_price', align: 'center',},
          {title: '定金', key: 'subscribe_price', align: 'center',},
          {title: '定金日期', key: 'subscribe_time', align: 'center',},
          {title: '首付', key: 'down_payment', align: 'center',},
          {title: '首付日期', key: 'down_payment_time', align: 'center',},
          // {title: '放款', key: 'received_price', align: 'center',},
          {
            title: '放款',
            // key: 'received_price',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Poptip', {
                  props: {
                    title: '回款记录',
                    trigger: "hover",
                    placement: 'right-start'
                  },
                  style: {
                    color: '#348EED',
                    cursor: 'pointer'
                  }
                }, [
                  params.row.received_price,
                  h('div', {
                    slot: 'content',
                    style: {whiteSpace: 'normal', wordBreak: 'break-all'}
                  }, [
                    h('Table', {
                      props: {
                        columns: this.subColumns,
                        data: params.row.received_payment_table || []
                      },
                      style: {
                        width: '250px'
                      }
                    }),
                  ])
                ])
              ])
            }
          },
          // {title: '放款时间', key: 'received_time', align: 'center',},
          {
            title: '放款时间',
            // key: 'received_time',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Poptip', {
                  props: {
                    title: '回款记录',
                    trigger: "hover",
                    placement: 'right-start'
                  },
                  style: {
                    color: '#348EED',
                    cursor: 'pointer'
                  }
                }, [
                  params.row.received_time,
                  h('div', {
                    slot: 'content',
                    style: {whiteSpace: 'normal', wordBreak: 'break-all'}
                  }, [
                    h('Table', {
                      props: {
                        columns: this.subColumns,
                        data: params.row.received_payment_table || []
                      },
                      style: {
                        width: '250px'
                      }
                    }),
                  ])
                ])
              ])
            }
          },
          {title: '佣金', key: 'commission_price', align: 'center',},
        ],
        // 表中表，放款记录
        subColumns: [
          {title: '放款金额', key: 'received_price', align: 'center',width:100},
          {title: '放款时间', key: 'received_time', align: 'center',width:147},
        ]
      }
    },
    props: ['mingXiList'],
  }
</script>

<style lang="less" scoped>
  .sales_commission_ming_xi_container {

  }
</style>
