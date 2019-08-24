<template>
  <div class="history_container">
    <Table border :columns="columns" :data="historyList" no-data-text="noDataText"></Table>
  </div>
</template>

<script>
  export default {
    name: "history",
    data() {
      return {
        columns:[
          {
            title: '操作时间',
            align: 'center',
            width:220,
            key: 'updated_at'
          },
          {
            title: '操作模块',
            align: 'center',
            width:160,
            key: 'model_name'
          },
          {
            title: '操作内容',
            align: 'center',
            key: 'desc'
          },
          {
            title: '操作者',
            align: 'center',
            width:160,
            key: 'worker_name'
          },
        ]
      }
    },
    props:['historyList','noDataText'],
    created() {},
    methods:{

    }
  }
</script>

<style lang="less" scoped>
  .history_container {

  }
</style>
