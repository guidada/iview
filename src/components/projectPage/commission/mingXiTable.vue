<template>
  <div class="ming_xi_commission_container">
    <!-- 通用顶部（时间筛选，返回）-->
    <Tabs
      type="card"
      :value="currentTab"
      @on-click="changeTab"
    >
      <TabPane label="住宅" name="住宅">
        <mingXiTableItem
          ref="zhuzhai"
          :filterTime="zhuZhaiFilterTime "
          :currentSubTap="currentTab"
          @cancelView="cancelView"
          @changeFilterTime="changeFilterTime"
        ></mingXiTableItem>
      </TabPane>
      <TabPane label="商铺" name="商铺">
        <mingXiTableItem
          ref="shangpu"
          :filterTime="shangPuFilterTime "
          :currentSubTap="currentTab"
          @cancelView="cancelView"
          @changeFilterTime="changeFilterTime"
        ></mingXiTableItem>
      </TabPane>
      <TabPane label="车位" name="车位">
        <mingXiTableItem
          ref="chewei"
          :filterTime="cheWeiFilterTime "
          :currentSubTap="currentTab"
          @cancelView="cancelView"
          @changeFilterTime="changeFilterTime"
        ></mingXiTableItem>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
  import mingXiTableItem from './mingXiTable/mingXiTableItem'

  export default {
    name: "mingXiTable",
    components: {
      mingXiTableItem,
    },
    data() {
      return {
        currentTab: '住宅',
        zhuZhaiFilterTime:null,
        shangPuFilterTime:null,
        cheWeiFilterTime:null,
      }
    },
    props: ['currentSubTap', 'filterTime'],
    created() {
      this.currentTab = this.currentSubTap
      this.zhuZhaiFilterTime = this.filterTime
      this.shangPuFilterTime = this.filterTime
      this.cheWeiFilterTime = this.filterTime
    },
    methods: {
      cancelView() {
        this.$emit('cancelView')
      },
      /*
      * 切换标签
      * */
      changeTab(tap) {
        this.currentTab = tap
        switch (tap) {
          case '住宅':
            this.$refs.zhuzhai.getMingXiListByTimeAndTap(this.zhuZhaiFilterTime ,tap)
            // this.$refs.zhuzhai.cancelView()
            break
          case '商铺':
            this.$refs.shangpu.getMingXiListByTimeAndTap(this.shangPuFilterTime ,tap)
            break
          case '车位':
            this.$refs.chewei.getMingXiListByTimeAndTap(this.cheWeiFilterTime ,tap)
            break
        }
      },
      /*
      * 切换时间
      * */
      changeFilterTime(res) {
        switch (res.tap) {
          case '住宅':
            this.zhuZhaiFilterTime = res.time
            break
          case '商铺':
           this.shangPuFilterTime = res.time
            break
          case '车位':
           this.cheWeiFilterTime = res.time
            break
        }
      }
    }
  }
</script>

<style lang="less">
  .ming_xi_commission_container {
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
