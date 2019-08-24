<template>
  <div class="index_container">
    <a :href="indexUrl" class="goToIndex">
      <Icon type="ios-home-outline" size="22"/>
      <span>返回首页</span>
    </a>
    <!-- 头部 -->
    <common-header class="com_header"></common-header>
    <!-- 主体 -->
    <div class="main">
      <router-view></router-view>
      <!--<defaultPage></defaultPage>-->
    </div>
  </div>
</template>

<script>
  import commonHeader from '@/components/common/commonHeader'
  import defaultPage from '@/components/defaultPage'

  export default {
    name: 'index',
    data() {
      return {
        indexUrl:window.location.origin
      }
    },
    created() {

    },
    components: {
      commonHeader,
      defaultPage,
    },
    methods: {}
  }
</script>

<style lang="less">
  .index_container {
    width: 100%;
    height: 100vh;
    overflow-y: hidden;
    background-color: #ffffff;

    .goToIndex {
      position: absolute;
      left: 80px;
      height: 64px;
      line-height: 64px;
      cursor: pointer;
      font-size: 14px;
      z-index: 999;

      &:hover {
        color: red;
      }
    }

    .com_header {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      background-color: #fff;
      z-index: 99;
      box-shadow: 0 1px 9px 1px rgba(0, 0, 0, .4);
    }

    .main {
      /*padding-top: 64px;*/
      width: 100%;
      height: 95vh;
      overflow-y: scroll;
    }
  }

</style>
