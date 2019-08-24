<template>

  <i-table size="large" border :columns="columns2" :data="data4"></i-table>
</template>

<script>
  
  export default {
    name: "reportList",
    data() {
      return {
        columns2: [{
            type: 'selection',
            width: 60,
            align: 'center',
            fixed: 'left',
          },
          {
            title: '报备客户',
            key: 'name',
            width: 100,
            align: 'center',
            fixed: 'left',
          },
          {
            title: '客户手机号',
            key: 'age',
            width: 200,
            align: 'center'
          },
          {
            title: '报备状态',
            key: 'province',
            width: 300,
            align: 'center'
          },
          {
            title: '客户来源',
            key: 'city',
            width: 100,
            align: 'center'
          },
          {
            title: '物业需求',
            key: 'address',
            width: 200,
            align: 'center'
          },
          {
            title: '到访接洽',
            key: 'zip',
            width: 200,
            align: 'center'
          },
          {
            title: '报备人员',
            key: 'zip',
            width: 100,
            align: 'center'
          },
          {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 120,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  }
                }, 'View'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  }
                }, 'Edit')
              ]);
            }
          }
        ],
        data4: [{
            name: '王小明',
            age: 18,
            address: '北京市朝阳区芍药居',
            province: '北京市',
            city: '朝阳区',
            zip: 100000
          },
          {
            name: '张小刚',
            age: 25,
            address: '北京市海淀区西二旗',
            province: '北京市',
            city: '海淀区',
            zip: 100000
          },
          {
            name: '李小红',
            age: 30,
            address: '上海市浦东新区世纪大道',
            province: '上海市',
            city: '浦东新区',
            zip: 100000
          },
          {
            name: '周小伟',
            age: 26,
            address: '深圳市南山区深南大道',
            province: '广东',
            city: '南山区',
            zip: 100000
          },
          {
            name: '王小明',
            age: 18,
            address: '北京市朝阳区芍药居',
            province: '北京市',
            city: '朝阳区',
            zip: 100000
          },
          {
            name: '张小刚',
            age: 25,
            address: '北京市海淀区西二旗',
            province: '北京市',
            city: '海淀区',
            zip: 100000
          },
          {
            name: '李小红',
            age: 30,
            address: '上海市浦东新区世纪大道',
            province: '上海市',
            city: '浦东新区',
            zip: 100000
          },
          {
            name: '周小伟',
            age: 26,
            address: '深圳市南山区深南大道',
            province: '广东',
            city: '南山区',
            zip: 100000
          }
        ]
      }
    },
    methods: {
      show(index) {
        this.$Modal.info({
          title: '用户信息',
          content: `姓名：${this.data6[index].name}<br>年龄：${this.data6[index].age}<br>地址：${this.data6[index].address}`
        })
      },
    },
    created() {
      // this.clientData = this.$route.params

    },
  }
</script>

<style>

</style>
