<template>
  <addSalesManagement
    v-if="isAddForm"
    :projectInfo="projectInfo"
    @cancelAdd="cancelAdd"
    @addSuccess="addSuccess"
  ></addSalesManagement>
  <editSalesManagement
    v-else-if="isEditForm"
    :isReadOnly="isReadOnly"
    :editSalesInfo="editSalesInfo"
    @cancelEdit="cancelEdit"
    @editSuccess="editSuccess"
  ></editSalesManagement>
  <div v-else class="sales_management_container">
    <!--搜索的部分-->
    <div class="search-Box">
      <Row>
        <Col span="3">
          <Select v-model="filterInfo.building" placeholder="楼栋" @on-change="getUnitList">
            <Option v-for="(item, index) in buildingList" :value="item.id" :key="index">{{item.building_num}}幢</Option>
          </Select>
        </Col>
        <Col span="3">
          <Select v-model="filterInfo.unit" placeholder="单元" @on-change="getRoomList">
            <Option v-for="(item, index) in unitList" :value="item.id" :key="index">{{item.unit_num}}单元</Option>
          </Select>
        </Col>
        <Col span="3">
          <Select v-model="filterInfo.house_id" placeholder="关联房源" @on-change="getCurrentRoomSalesManagement">
            <Option v-for="(item, index) in roomList" :value="item.id" :key="index">{{item.room}}室</Option>
          </Select>
        </Col>
        <Col span="3" offset="1">
          <Select v-model="filterState" placeholder="销售状态" @on-change="getCurrentStateSalesManagement">
            <Option v-for="(item, index) in stateList" :value="item" :key="index">{{item}}</Option>
          </Select>
        </Col>
        <Col span="3" offset="1">
          <Select v-model="activeId" placeholder="关联活动" @on-change="getCurrentActiveSalesManagement">
            <Option v-for="(item, index) in activityList" :value="item.id" :key="index">{{item.name}}</Option>
          </Select>
        </Col>
        <Col span="5" offset="1">
          <DatePicker
            type="daterange"
            placement="bottom-end"
            placeholder="开始时间~结束时间"
            style="width: 210px"
            @on-change="getTimeSalesManagement"
          ></DatePicker>
        </Col>
      </Row>
    </div>
    <!--新建按钮-->
    <Button type="primary" @click="addSalesForm">新建销控单</Button>
    <!--表单列表-->
    <div class="sales_list_wrap">
      <Table border :columns="columns" :data="salesList" :no-data-text="noDataText"></Table>
    </div>
    <!--分页-->
    <div class="page_wrap">
      <Page :total="totalCount" :page-size="pageSize" @on-change="changePage"></Page>
    </div>
  </div>
</template>

<script>
  import addSalesManagement from './salesManagement/addSalesManagement'
  import editSalesManagement from './salesManagement/editSalesManagement'

  export default {
    name: "salesManagement",
    components: {
      addSalesManagement,
      editSalesManagement,
    },
    data() {
      return {
        // 当前项目的基本信息
        projectInfo: {},
        // 销控单列表
        salesList: [],
        // 优惠后的签约总价列表
        signPriceList:[],
        //  表单关键词，
        columns: [
          {
            title: 'ID',
            width: 80,
            align: 'center',
            key: 'id'
          },
          {
            title: '关联房源',
            align: 'center',
            key: 'house_num'
          },
          {
            title: '销售活动',
            align: 'center',
            key: 'active'
          },
          {
            title: '销售状态',
            align: 'center',
            key: 'state'
          },
          {
            title: '创建时间',
            key: 'created_at',
            align: 'center'
          },
          {
            title: '操作',
            key: 'action',
            width: 300,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',
                    color: '#2d8cf0'
                  },
                  on: {
                    click: () => {
                      this.salesView(params.row)
                    }
                  }
                }, '查看'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#2d8cf0'
                  },
                  on: {
                    click: () => {
                      this.salesEdit(params.row)
                    }
                  }
                }, '跟进'),
                (params.row.state === '签约中') ? h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#009900'
                  },
                  on: {
                    click: () => {
                      this.printForm(params.row)
                    }
                  }
                }, '打印签约审批单') : '',
              ])
            }
          }
        ],
        // 要关联的房源id
        filterHouse: '',
        // 销售状态列表
        stateList: ["认筹中", "认购", "签约中", "已签约", "回款", "交房", "办证", "完毕"],
        // 活动列表
        activityList: [],
        // 要筛选的状态
        filterState: '',
        // 要筛选的活动
        activeId: '',
        // 是否新建销控单
        isAddForm: false,
        // 要编辑的销控单的信息
        editSalesInfo: {},
        // 是否编辑销控单
        isEditForm: false,
        // 是否查看销控单
        isReadOnly: false,
        // 销控单总条数
        totalCount: 0,
        // 每页显示数量
        pageSize: 10,
        // 楼栋号列表
        buildingList: null,
        // 当前选中的楼栋id
        buildId: null,
        // 单元号列表
        unitList: null,
        // 房源号列表
        roomList: null,
        // 筛选销控单的依据
        filterInfo: {
          project_id: parseInt(this.$route.params.id),
          page: 1,
          building: null,
          unit: null,
          house_id: null,
          activity_id: null,
          start_time: null,
          end_time: null,
        },
        // 查看销控单时，只读
        globalReadOnly: false,
        noDataText:'暂无数据'
      }
    },
    created() {
      this.getProjectInfo(parseInt(this.$route.params.id))
      this.getBuildingList()
      this.getSalesManagement(this.filterInfo)
    },
    methods: {
      /*
      *  获取到当前项目的信息
      * */
      getProjectInfo(id) {
        this.$post('/project/lists').then(res => {
          if (res.status_code !== 200) return this.$Message.error('获取项目信息失败！')
          var result = res.data.project
          this.projectInfo = result.find(item => {
            return item.id === id
          })
        }).catch(err => {
          this.$Message.error('获取项目信息失败！')
        })
      },
      /*
      *  获取到楼栋清单,以及活动清单
      * */
      getBuildingList() {
        var filterInfo = {
          project_id: parseInt(this.$route.params.id)
        }
        this.$post('/follow/house', filterInfo).then(res => {
          if (res.status_code !== 200) return this.$Message.error('获取房源列表失败！')
          this.buildingList = res.data.building
          this.activityList = res.data.activity
          this.activityList.unshift({
            id: 0,
            name: '无'
          })
        }).catch(err => {
          this.$Message.error('获取房源列表失败！')
        })
      },
      /*
     *  获取到指定楼栋的单元清单
     * */
      getUnitList(buildId) {
        this.buildId = buildId
        var filterInfo = {
          project_id: parseInt(this.$route.params.id),
          building_id: buildId,
        }
        this.$post('/follow/house', filterInfo).then(res => {
          if (res.status_code !== 200) return this.$Message.error('获取房源列表失败！')
          this.filterInfo.unit = null
          this.filterInfo.house_id = null
          this.unitList = res.data.unit
        }).catch(err => {
          this.$Message.error('获取房源列表失败！')
        })
      },
      /*
     *  获取到指定单元的房源清单
     * */
      getRoomList(unitId) {
        var filterInfo = {
          project_id: parseInt(this.$route.params.id),
          building_id: this.buildId,
          unit_id: unitId,
        }
        this.$post('/follow/house', filterInfo).then(res => {
          if (res.status_code !== 200) return this.$Message.error('获取房源列表失败！')
          this.filterInfo.house_id = null
          this.roomList = res.data.house
        }).catch(err => {
          this.$Message.error('获取房源列表失败！')
        })
      },
      /*
      *  获取到当前房源的销控单
      * */
      getCurrentRoomSalesManagement(house_id) {
        this.filterInfo.house_id = house_id
        this.filterInfo.page = 1
        this.getSalesManagement(this.filterInfo)
      },
      /*
      *  获取到指定状态的销控单
      * */
      getCurrentStateSalesManagement(state) {
        this.filterInfo.state = state
        this.filterInfo.page = 1
        this.getSalesManagement(this.filterInfo)
      },
      /*
      * 获取到指定活动的销控单
      * */
      getCurrentActiveSalesManagement(active) {
        this.filterInfo.activity_id = active
        this.filterInfo.page = 1
        this.getSalesManagement(this.filterInfo)
      },
      /*
      *  获取指定时间内的销控单
      * */
      getTimeSalesManagement(t) {
        this.filterInfo.start_time = t[0]
        this.filterInfo.end_time = t[1]
        this.filterInfo.page = 1
        this.getSalesManagement(this.filterInfo)
      },
      /*
      *  获取销控单列表
      * */
      getSalesManagement(filterInfo) {
        this.$post('/follow/lists', filterInfo).then(res => {
          if (res.data === '没有权限') {
            this.noDataText = '没有权限'
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('获取建销控单列表失败！')
          var follow = res.data.follow
          follow.forEach(item => {
            item.house_num = item.house.house_num
            item.active = item.activity.name
          })
          this.salesList = res.data.follow
          this.signPriceList = res.data.sign_price
          this.totalCount = res.data.count
        }).catch(err => {
          this.$Message.error('获取建销控单列表失败！')
        })
      },
      /*
      * 跳转到新建销控单页面
      * */
      addSalesForm() {
        this.isAddForm = true
      },
      /*
     * 取消添加销控单
     * */
      cancelAdd() {
        this.isAddForm = false
      },
      /*
      * 添加销控单成功之后的处理，获取最新的表单
      * */
      addSuccess() {
        this.isAddForm = false
        this.filterInfo = {
          project_id: parseInt(this.$route.params.id),
          page: 1,
          building: null,
          unit: null,
          house_id: null,
          activity_id: null,
          start_time: null,
          end_time: null,
        }
        this.getSalesManagement(this.filterInfo)
      },
      /*
      *  打印签约单
      * */
      printForm(row) {
        var id = row.id
        var project_name = row.project.name
        var currentDate = new Date()
        this.$post('/follow/signList', {follow_id: id}).then(res => {
          if (res.data === '没有权限') {
            this.$Modal.error({
              title: '警告',
              content: '没有权限'
            })
            return false
          }
          if (res.status_code !== 200) return this.$Message.error('打印签约审批单失败！')
          var result = res.data.sign

          var iframe = document.getElementById("print-iframe")
          if (!iframe) {
            var el = document.getElementById("printcontent")
            iframe = document.createElement('IFRAME')
            var doc = null
            iframe.setAttribute("id", "print-iframe")
            iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;')
            document.body.appendChild(iframe)
            doc = iframe.contentWindow.document
            //这里可以自定义样式
            //doc.write("<LINK rel="stylesheet" type="text/css" href="css/print.css">");
            doc.write(`
          <div>
           <table
             cellspacing="1"
             border
             style="width: 100%;line-height: 35px;text-align: center;border-collapse: collapse;padding: 2px;">
             <caption style="font-size: 20px;font-weight: bold;padding: 15px 0;">【${project_name}】商品房签约审批单</caption>

              <tr>
          <th>客户</th>
           <td>${result.customer_name}</td>
          <th>房号</th>
          <td colspan="3">
          <span>${result.building}幢</span>
          <span>${result.unit}单元</span>
          <span>${result.room}号房</span>
</td>
        </tr>
        <tr>
          <th>建筑面积（㎡）</th>
           <td>${result.mianji}㎡</td>
          <th>下定日期</th>
          <td>${this.formatTime(new Date(result.subscribe_time.date))}</td>
          <th>签约日期</th>
          <td>${this.formatTime(new Date(result.down_payment_time.date))}</td>
        </tr>
        <tr>
          <th>成交单价（元）</th>
          <td></td>
          <th>成交总价（元）</th>
          <td>${result.sign_price}元</td>
          <th rowspan="3">付款方式</th>
          <td rowspan="3">${result.payment}</td>
        </tr>
        <tr>
          <th>首付金额（元）</th>
          <td>${result.down_payment}元</td>
          <th>贷款金额（元）</th>
          <td></td>
        </tr>
        <tr>
          <th>已付款（元）</th>
          <td>${result.pay_price}元</td>
          <th>应付款（元）</th>
          <td>${result.un_pay_price}元</td>
        </tr>
        <tr>
          <th>备述</th>
          <td colspan="5"></td>
        </tr>
        <tr>
          <th rowspan="2">审核</th>
          <th>经办人</th>
          <th>销售经理</th>
          <th>审核人</th>
          <th>财务</th>
          <th>董事长助理</th>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td><span style="font-size: 1px">.</span></td>
        </tr>
      </table>
      <div style="padding: 30px">
        <div style="display: flex;justify-content: space-between;line-height: 30px">
          <div style="flex: 1">买受人：______________，_______________</div>
          <div style="flex: 1">身份证：______________，_______________</div>
        </div>
        <div style="display: flex;justify-content: space-between;line-height: 30px">
          <div style="flex: 1">通讯地址：_______________</div>
          <div style="flex: 1">邮编：_______________</div>
          <div style="flex: 1">电话：_______________</div>
        </div>
        <div style="display: flex;justify-content: space-between;line-height: 30px">
          <div style="flex: 1">买受人信息确认签字：_______________，________________</div>
        </div>
        <div style="display: flex;justify-content: flex-end;line-height: 30px">
          <!--<div>${this.formatTime(currentDate)}</div>-->
          <div>____年____月____日</div>
        </div>
      </div>
          </div>
`)
            doc.close()
            iframe.contentWindow.focus()
          }
          iframe.contentWindow.print()
          if (navigator.userAgent.indexOf("MSIE") > 0) {
            document.body.removeChild(iframe)
          }
        }).catch(err => {
          this.$Message.error('打印签约审批单失败！')
          console.log(err)
        })
      },
      /*
      * 去编辑销控单
      * */
      salesEdit(res) {
        var state = res.state
        var disabledStateList = ['已取消','已完结','解筹', '解筹中', '已解筹', '退房', '退房中', '已退房', '退认购金', '退认购金中', '已退认购金']
        if (disabledStateList.indexOf(state) !== -1) return this.$Modal.warning({
          title: '警告：ID' + res.id + '不可编辑',
          content: `
          <div>当前销控单状态为 <span style="color: red">${state}</span> ，请点击 <span style="color: #2baee9">查看</span> 按钮查看销控单信息</div>
          `
        })
        var priceInfo = this.signPriceList.find(item=>{
          return item.id === res.id
        })
        res.sign_price = priceInfo.price
        this.editSalesInfo = res
        this.isEditForm = true
        this.isReadOnly = false
      },
      /*
      * 取消编辑销控单
      * */
      cancelEdit() {
        this.editSuccess()
      },
      /*
      * 编辑销控单成功的处理
      * */
      editSuccess() {
        this.isEditForm = false
        this.filterInfo = {
          project_id: parseInt(this.$route.params.id),
          page: this.filterInfo.page,
          building: null,
          unit: null,
          house_id: null,
          activity_id: null,
          start_time: null,
          end_time: null,
        }
        this.getSalesManagement(this.filterInfo)
      },
      /*
      * 页面切换的方法
      * */
      changePage(page) {
        this.filterInfo.page = parseInt(page)
        this.getSalesManagement(this.filterInfo)
      },
      /*
      * 查看销控单
      * */
      salesView(res) {
        var priceInfo = this.signPriceList.find(item=>{
          return item.id === res.id
        })
        res.sign_price = priceInfo.price
        this.isReadOnly = true
        this.editSalesInfo = res
        this.isEditForm = true
      },
      /*
      * 时间格式化
      * */
      formatTime(t) {
        return t.getFullYear() + '年' + this.formatNum(t.getMonth() + 1) + '月' + this.formatNum(t.getDate()) + '日'
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

<style lang="less" scoped>
  .sales_management_container {
    padding: 30px;

    .search-Box {
      margin-bottom: 30px;
    }

    .sales_list_wrap {
      margin-top: 30px;
    }

    .page_wrap {
      margin-top: 30px;
      display: flex;
      justify-content: center;
    }

  }
</style>
