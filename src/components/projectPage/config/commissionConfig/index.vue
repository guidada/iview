<template>
  <div class="commission_config_container">
    <Tabs type="card" :value="currentTab">
      <TabPane label="开发商结算配置--住宅" name="住宅">
        <zhuZhaiCommission></zhuZhaiCommission>
      </TabPane>
      <TabPane label="开发商结算配置--商铺" name="商铺">
        <shangpuCommission></shangpuCommission>
      </TabPane>
      <TabPane label="销售结算配置" name="销售">
        <salesCommission></salesCommission>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
  import salesCommission from './xiaoshou'
  import zhuZhaiCommission from './zhuZhai'
  import shangpuCommission from './shangpu'

  export default {
    name: "index",
    components: {
      salesCommission,
      zhuZhaiCommission,
      shangpuCommission
    },
    data() {
      return {
        currentTab: '住宅',

      }
    },
    created() {


    },
    methods: {}
  }
</script>

<style lang="less">
  .commission_config_container {
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

    .form_box {
      margin-bottom: 30px;

      .btn_wrap {
        display: flex;
        justify-content: center;
        margin-top: 30px;
      }
    }

  }
</style>
