<template>
  <div>
    <div class="approve-item" v-for="(item,index) in approveList" :key="index">
      <div class="approve-title">{{item.title}}</div>
      <div class="approve-operation">
        <router-link :to="{name:'approveEdit',params: {type: index}}">审批流程</router-link>
        <span class="button">启用</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "approve",
    data() {
      return {
        approveList: [
          {
            title: '优惠单'
          },
          {
            title: '买受人变更'
          },
          {
            title: '解筹申请'
          },
          {
            title: '退认购金'
          },
          {
            title: '已签约退房'
          },
          {
            title: '取消销控单'
          }
        ]
      }
    },
    created() {
      /*this.$post('/config/discountListConfigSj', {
        project_id: 14
      })*/
    }
  }
</script>

<style lang="less">
  .approve-item {
    padding: 20px;
    background: #f0f2f5;
    line-height: 60px;
    font-size: 14px;
    display: flex;
    margin: 20px 20px 0 20px;
    .approve-title {
      flex: 1
    }
    .approve-operation {
      flex: 1;
      text-align: right;
      color: #2d8cf0;
      a {
        color: #2d8cf0;
      }
      .button {
        margin-left: 20px;
      }
    }
  }
</style>

