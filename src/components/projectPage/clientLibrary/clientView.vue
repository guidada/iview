<template>
  <div class="project-container">
    <Form :model="clientData" :label-width="200">
        <FormItem label="客户姓名：">
          {{clientData.name}}
        </FormItem>
        <FormItem label="客户性别">
          {{clientData.sex == 0? '未知':clientData.sex == 1?'男':'女'}}
        </FormItem>
        <FormItem label="联系方式：">
          {{clientData.phone}}
        </FormItem>
        <FormItem label="居住地址：">
          {{`${clientData.province}/${clientData.city}/${clientData.district}/${clientData.address}`}}
        </FormItem>
        <FormItem label="身份证号：">
          {{clientData.idcard}}
        </FormItem>
        <FormItem label="身份证正面照：">
          <img class="idcard" :src="clientData.positive_photo" alt="">
        </FormItem>
        <FormItem label="身份证反面照：">
          <img class="idcard" :src="clientData.negative_photo" alt="">
        </FormItem>
        <FormItem label="备注：">
          {{clientData.desc}}
        </FormItem>
        <FormItem>
          <Button type="default" @click="$router.go(-1)">返回</Button>
        </FormItem>
    </Form>
  </div>
</template>

<script>
  export default {
    name: "clientCreate",
    data() {
      return {
        clientData: {}
      }  
    },
    methods: {},
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
