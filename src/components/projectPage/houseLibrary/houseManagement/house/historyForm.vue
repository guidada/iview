<template>
  <div class="buyer_history_container">
    <Table border :columns="columns" :data="historyList"></Table>
  </div>
</template>

<script>
  export default {
    name: "historyForm",
    data() {
      return {
        // 变更时间，操作人，买受人信息（姓名／联系方式／身份证号／身份证件）
        columns: [
          {title: '姓名', key: 'name', align: 'center'},
          {title: '联系方式', key: 'phone', align: 'center'},
          {title: '身份证号', key: 'idcard', width: 200, align: 'center'},
          {
            title: '身份证件',
            width: 160,
            // key: 'positive_photo',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('a', {
                  style: {
                    color: '#348EED'
                  },
                  on: {
                    click: () => {
                      this.showPhoto(params.row.positive_photo, '正')
                    }
                  }
                }, '正面'),
                h('a', {
                  style: {
                    marginLeft: '20px',
                    color: 'red'
                  },
                  on: {
                    click: () => {
                      this.showPhoto(params.row.negative_photo, '反')
                    }
                  }
                }, '反面')
              ])
            }
          },
          // {title: '身份证件(反)', key: 'negative_photo', align: 'center'},
          {title: '变更时间', key: 'updated_at', align: 'center'},
          // {title: '操作人', key: 'number', align: 'center'},
        ],
      }
    },
    props: ['historyList'],
    created() {

    },
    methods: {
      showPhoto(res, dir) {
        this.$Modal.info({
          title: '身份证件(' + dir + ')',
          content: `<img src="${res}" width="100%">`,
          width: 800
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .buyer_history_container {

  }
</style>
