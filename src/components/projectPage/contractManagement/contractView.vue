<template>
  <div class="project-container">
    <Form :label-width="200">
        <FormItem label="关联项目：">
          {{contractData.project_name}}
        </FormItem>
        <FormItem label="关联房源：">
          <div v-if="contractData.house">
            {{`${contractData.house.building}-${contractData.house.unit}-${contractData.house.room}`}}
          </div>
        </FormItem>
        <FormItem label="上传合同附件：">
          <div v-if="contractData.img">
            <div v-for="(item,index) in contractData.img" :key="index" >
              <a :href="item" target="_blank">{{"附件"+ index}}</a>
            </div>
          </div>
        </FormItem>
        <FormItem>
          <div class="form-item">
            <Button type="default" @click="$router.go(-1)">返回</Button>
          </div>
        </FormItem>
    </Form>
  </div>
</template>

<script>
  export default {
    name: "contractView",
    data() {
      return {
        contractData: {

        }
      }  
    },
    created() {
      this.contractData = this.$route.params
    }
  }
</script>

<style lang="less" scoped>
.search-panel {
  .search-item {
    &__label {
     line-height: 32px;
     text-align: center; 
    }
  }
}
.project-container {
  padding: 20px 30px 50px;
}
.client-content {
  margin: 20px 0;
}
.form-item {
  width: 300px;
}
</style>
