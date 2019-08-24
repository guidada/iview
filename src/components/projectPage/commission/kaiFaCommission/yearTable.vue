<template>
  <div class="year_commission_container">
    <Row>
      <Col span="12">
        <DatePicker
          type="year"
          style="width: 200px"
          v-model="filterYear"
          @on-change="changefilterYear"
          :options="disabledate"
        ></DatePicker>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <div class="table_wrap">
          <div class="table_header">
            <h3>{{currentYear}}年度--住宅结佣明细:</h3>
            <Button
              type="info"
              @click="exportData('住宅')"
            >
              <Icon type="ios-download-outline"></Icon>
              导出住宅结佣明细
            </Button>
          </div>
          <Table
            ref="zhuZhuaiTable"
            :columns="columnsZhuZhai"
            :data="zhuZhuaiYearMingXiList"
            :no-data-text="noDataText"
            border></Table>
        </div>
      </Col>
      <Col span="24">
        <div class="table_wrap">
          <div class="table_header">
            <h3>{{currentYear}}年度--商铺结佣明细:</h3>
            <Button
              type="info"
              @click="exportData('商铺')"
            >
              <Icon type="ios-download-outline"></Icon>
              导出商铺结佣明细
            </Button>
          </div>
          <Table
            ref="shangPuTable"
            :columns="columnsShangPu"
            :data="shangPuYearMingXiList"
            :no-data-text="noDataText"
            border></Table>
        </div>
      </Col>
      <Col span="24">
        <div class="table_wrap">
          <div class="table_header">
            <h3>{{currentYear}}年度--车位结佣明细:</h3>
            <Button
              type="info"
              @click="exportData('车位')"
            >
              <Icon type="ios-download-outline"></Icon>
              导出车位结佣明细
            </Button>
          </div>
          <Table
            ref="cheWeiTable"
            :columns="columnsCheWei"
            :data="cheWeiYearMingXiList"
            :no-data-text="noDataText"
            border></Table>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>


  export default {
    name: "yearTable",
    data() {
      return {
        // 筛选年份，临时记录
        filterYear: new Date(),
        // 当前选择的年份
        currentYear: 'xxxx',
        disabledate: {
          disabledDate(date) {
            return date && date.valueOf() > Date.now()
          }
        },
        // 住宅明细
        zhuZhuaiYearMingXiList: [{month: 1}],
        // 商铺明细
        shangPuYearMingXiList: [{month: 1}],
        // 车位明细
        cheWeiYearMingXiList: [{month: 1}],
        columnsZhuZhai: [
          {
            title: '月份',
            key: 'month',
            align: 'center',
            width: 120,
          },
          {
            title: '住宅',
            align: 'center',
            children: [
              {
                title: '回款基数',
                key: 'back_price',
                align: 'center',
              },
              {
                title: '佣金率',
                key: 'ratio',
                align: 'center',
              },
              {
                title: '佣金比例',
                key: 'commission',
                align: 'center',
              },
              {
                title: '佣金额',
                key: 'commission_price',
                align: 'center',
              },
              {
                title: '操作',
                align: 'center',
                render: (h, params) => {
                  if (params.row._index<12) {
                    return h('div', [
                      h('span', {
                        style: {
                          color: '#348EED',
                          cursor: 'pointer'
                        },
                        on: {
                          click: () => {
                            this.gotoViewMingXiForm('住宅', params.row)
                          }
                        }
                      }, '明细')
                    ])
                  }
                }
              }
            ]
          },
        ],
        columnsShangPu: [
          {
            title: '月份',
            key: 'month',
            align: 'center',
            width: 120,
          },
          {
            title: '商铺',
            align: 'center',
            children: [
              {
                title: '回款基数',
                key: 'un_back_price',
                align: 'center',
              },
              {
                title: '佣金率',
                key: 'ratio',
                align: 'center',
              },
              {
                title: '佣金比例',
                key: 'commission',
                align: 'center',
              },
              {
                title: '佣金额',
                key: 'un_commission_price',
                align: 'center',
              },
              {
                title: '操作',
                align: 'center',
                render: (h, params) => {
                 if (params.row._index<12) {
                   return h('div', [
                     h('span', {
                       style: {
                         color: '#348EED',
                         cursor: 'pointer'
                       },
                       on: {
                         click: () => {
                           this.gotoViewMingXiForm('商铺', params.row)
                         }
                       }
                     }, '明细')
                   ])
                 }
                }
              }
            ]
          },
        ],
        columnsCheWei: [
          {
            title: '月份',
            key: 'month',
            align: 'center',
            width: 120,
          },
          {
            title: '车位',
            align: 'center',
            children: [
              {
                title: '回款基数',
                key: 'un_back_price',
                align: 'center',
              },
              {
                title: '佣金率',
                key: 'ratio',
                align: 'center',
              },
              {
                title: '佣金比例',
                key: 'commission',
                align: 'center',
              },
              {
                title: '佣金额',
                key: 'un_commission_price',
                align: 'center',
              },
              {
                title: '操作',
                align: 'center',
                render: (h, params) => {
                  if (params.row._index<12) {
                    return h('div', [
                      h('span', {
                        style: {
                          color: '#348EED',
                          cursor: 'pointer'
                        },
                        on: {
                          click: () => {
                            this.gotoViewMingXiForm('车位', params.row)
                          }
                        }
                      }, '明细')
                    ])
                  }
                }
              }
            ]
          },
        ],
        noDataText:'暂无数据'
      }
    },
    created() {
      var t = new Date()
      this.currentYear = t.getFullYear()
      this.getYearMingXi(this.currentYear)
    },
    methods: {
      /*
      * 修改筛选时间，获取到指定年度的明细
      * */
      changefilterYear(year) {
        this.currentYear = year
        this.getYearMingXi(year)
      },
      /*
      *  获取到指定年度结佣明细的方法
      * */
      getYearMingXi(year) {
        this.$post('/commission/commissionYear', {
          project_id: parseInt(this.$route.params.id),
          time: year
        }).then(res => {
          // console.log('获取年度明细的返回结果===', res)
          if (res.data === '没有权限') {
            this.noDataText = '没有权限'
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('获取年度明细失败！')
          this.$Message.success('获取' + year + '年度明细成功！')
          var result = res.data.commission_year
          var zhuZhuaiYearMingXiList = result[0]
          var shangPuYearMingXiList = result[1]
          var cheWeiYearMingXiList = result[2]
          // 格式化各个明细列表，并赋值渲染
          this.zhuZhuaiYearMingXiList = this.formatMingXiList(zhuZhuaiYearMingXiList)
          this.shangPuYearMingXiList = this.formatMingXiList(shangPuYearMingXiList)
          this.cheWeiYearMingXiList = this.formatMingXiList(cheWeiYearMingXiList)

        }).catch(err => {
          this.$Message.error('获取年度明细失败！')
          console.log(err)
        })
      },
      /*
      *  格式化（住宅，商铺，车位）明细列表数据
      * */
      formatMingXiList(list) {
        var back_price = 0
        var un_back_price = 0
        var commission_price = 0
        var un_commission_price = 0
        list.splice(12, 1)
        // console.log('list======================',list)
        list.forEach((item, index) => {
          item.month = this.currentYear + '-' + this.formatNum(index + 1)
          back_price += parseFloat(item.back_price)
          un_back_price += parseFloat(item.un_back_price)
          commission_price += parseFloat(item.commission_price)
          un_commission_price += parseFloat(item.un_commission_price)
        })
        list.push({
          month: '合计',
          back_price: back_price,
          un_back_price: un_back_price,
          ratio: "-",
          commission: "-",
          uncommission: "-",
          commission_price: commission_price,
          un_commission_price: un_commission_price
        })
        return list
      },
      /*
      *  去查看明细（住宅，商铺，车位等）
      * */
      gotoViewMingXiForm(type, row) {
        if (row._index>11) return this.$Message.error('不可查看')
        var info = {
          currentSubTap:type,
          isShowMingXi:true,
          time:row.month
        }
        this.$emit('showMingXi',info)
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
      /*
      *  导出数据
      * */
      exportData(type) {
        if (type === '住宅') {
          this.$refs.zhuZhuaiTable.exportCsv({
            filename: this.currentYear + '年度住宅佣金结算明细'
          })
        } else if (type === '商铺') {
          this.$refs.shangPuTable.exportCsv({
            filename: this.currentYear + '年度商铺佣金结算明细'
          })
        } else if (type === '车位') {
          this.$refs.cheWeiTable.exportCsv({
            filename: this.currentYear + '年度车位佣金结算明细'
          })
        } else {
          var dataList = this.zhuZhuaiYearMingXiList.concat(this.shangPuYearMingXiList,this.cheWeiYearMingXiList)
          this.$refs.cheWeiTable.exportCsv({
            filename: this.currentYear + '年度佣金结算明细',
            data: dataList
          })
        }
      },
    }
  }
</script>

<style lang="less" scoped>
  .year_commission_container {
    .table_wrap {
      margin-top: 30px;

      .table_header {
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        padding: 0 15px;

        h3 {
          line-height: 35px;
          font-size: 14px;
        }
      }
    }
  }
</style>
