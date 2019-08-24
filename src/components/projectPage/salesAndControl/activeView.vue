<template>
  <div class="project-container">
    <Form :model="clientData" :label-width="200">
        <FormItem label="主题名称：">
          {{clientData.name}}
        </FormItem>
        <FormItem label="类型：">
          {{clientData.leixing}}
        </FormItem>
        <FormItem label="起止日期：">
          {{this.formatTime(clientData.start_time.date) + '-' + this.formatTime(clientData.end_time.date)}}
        </FormItem>
        <FormItem label="优惠方式：">
          {{clientData.type == "先折后减"? `房价总价${clientData.discount}折后减${clientData.reduce}元`: `房价总价减${clientData.reduce}元后${clientData.discount}折`}}
        </FormItem>
        <FormItem label="认购金额：">
          {{clientData.subscribe_price}}
        </FormItem>
        <FormItem label="认筹标准：">
          {{clientData.renchou_price}}
        </FormItem>
        <FormItem>
          <Button type="default" @click="$router.go(-1)">返回</Button>
        </FormItem>
    </Form>
  </div>
</template>

<script>
  export default {
    name: "activeView",
    data() {
      return {
        clientData: {}
      }  
    },
    methods: {
      formatTime(data) {
        return new Date(data).getFullYear() + '/' + (new Date(data).getMonth()+1) + '/' + new Date(data).getDate()
      },
    },
    created() {
      this.clientData = this.$route.params
    }
  }
</script>

<style lang="less" scoped>
.idcard {
  max-width: 600px;
}
</style>
