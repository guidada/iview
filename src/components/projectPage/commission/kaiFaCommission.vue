<template>
  <mingXiTable
    v-if="isShowMingXi"
    :currentSubTap="currentSubTap"
    :filterTime="filterTime"
    @cancelView="cancelView"
  ></mingXiTable>
  <div v-else class="kai_fa_commission_container">
    <Tabs type="card" :value="currentTab">
      <TabPane label="佣金结算明细" name="mingXiInfo">
        <jieSuanMingXiTable></jieSuanMingXiTable>
      </TabPane>
      <TabPane label="年度报表" name="yearInfo">
        <yearTable
          @showMingXi="showMingXi"
        ></yearTable>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
  import jieSuanMingXiTable from './kaiFaCommission/jieSuanMingXiTable'
  import yearTable from './kaiFaCommission/yearTable'
  import mingXiTable from './mingXiTable'

  export default {
    name: "kaiFaCommission",
    components: {
      jieSuanMingXiTable,
      yearTable,
      mingXiTable
    },
    data() {
      return {
        currentTab: 'mingXiInfo',
        // 是否展示明细
        isShowMingXi: false,
        // 明细的tap标签
        currentSubTap: '住宅',
        // 明细的筛选时间
        filterTime: null
      }
    },
    created() {

    },
    methods: {
      /*
      * 获取到明细的基本信息
      * */
      showMingXi(info) {
        // console.log('info==========', info)
        this.isShowMingXi = info.isShowMingXi
        this.currentSubTap = info.currentSubTap
        this.filterTime = info.time
      },
      /*
      * 取消查看明细
      * */
      cancelView() {
        this.isShowMingXi = false
        this.currentTab = 'yearInfo'
      },
    }
  }
</script>

<style lang="less">
  .kai_fa_commission_container {
    padding: 30px;

    /*标签*/
    .ivu-tabs-nav-scroll {
      background-color: #f2f2f2;
    }
    .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-nav-container {
      height: 71px;
    }
    .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
      background-color: #F2F2F2;
      font-size: 18px;
      color: #797979;
      padding: 0 50px;
      border: 0;
      font-weight: 700;
      height: 70px;
      line-height: 70px;
      border-radius: 0;
    }
    .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
      background-color: #8CC8FF;
      color: #ffffff;
    }
    .ivu-tabs-bar {
      margin-bottom: 40px;
      border: 0;
    }
    .ivu-col {
      min-width: 165px;
    }

  }
</style>
