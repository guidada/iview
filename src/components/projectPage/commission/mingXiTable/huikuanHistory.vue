<template>
  <div class="hui_kuan_history_container">
    <Table
      :columns="columns"
      :data="huiKuanList"
      border></Table>
  </div>
</template>

<script>
  export default {
    name: "huikuanHistory",
    data() {
      return {
        columns:[
          {title: '序号', key: 'index', align: 'center'},
          {title: '放款金额（元）', key: 'price', align: 'center'},
          {title: '放款日期', key: 'time', align: 'center'},
        ],
      }
    },
    props:['huiKuanList'],
  }
</script>

<style lang="less" scoped>
  .hui_kuan_history_container {
    width: 100%;
    height: 100%;
  }
</style>
