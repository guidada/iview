<template>
  <div class="commission_history_container">
    <div class="table_header">
      <span>总结佣基数（元）：<span style="color: #348EED">{{historyInfo.sign_price}}</span>元</span>
      <span>佣金率：{{historyInfo.ratio}}%</span>
      <span>佣金总额（元）：{{historyInfo.total_commission_price}}元</span>
      <span>剩余未结佣金额（元）：<span style="color: red">{{historyInfo.un_commission_price}}</span>元</span>
    </div>
    <div class="table_wrap">
      <Table
        :columns="columns"
        :data="historyList"
        border></Table>
    </div>
  </div>
</template>

<script>
  export default {
    name: "history",
    data() {
      return {
        columns: [
          // {title: '序号', key: 'index', align: 'center'},
          {title: '结佣月份', key: 'back_month', align: 'center'},
          {title: '结佣基数（元）', key: 'price', align: 'center'},
          {title: '佣金率', key: 'ratio', align: 'center'},
          {title: '结佣比例', key: 'commission', align: 'center'},
          {title: '佣金额（元）', key: 'commission_price', align: 'center'},
        ]
      }
    },
    props: ['historyList','historyInfo'],
  }
</script>

<style lang="less" scoped>
  .commission_history_container {
    width: 100%;
    height: 100%;

    .table_header {
      font-weight: bolder;
      font-size: 14px;
      text-align: center;
      margin-bottom: 20px;
      span {
        margin: 0 10px;
      }
    }

    .table_wrap {
      max-height: 500px;
      overflow-y: scroll;
    }
  }
</style>
