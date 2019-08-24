<template>
   <Tabs @on-click="tabChange">
        <Tab-pane label="全部数据">
           <reportList></reportList>
          </Tab-pane>
        <Tab-pane label="案场自访">
          <reportList></reportList>
          </Tab-pane>
        <Tab-pane label="外拓">
         <reportList></reportList>
          </Tab-pane>
        <Tab-pane label="全名经济">
          <reportList></reportList>
          </Tab-pane>
        <Tab-pane label="中介分销">
         <reportList></reportList>
          </Tab-pane>
        <Tab-pane label="老带新">
        <reportList></reportList>
         </Tab-pane>
    </Tabs>
</template>

<script>
  import reportList from './customer/reportList.vue'
  export default {
    name: "customerReporting",
    components:{
       reportList
    },
    data() {
      return {

         // clientData: {}
      }
    },
    methods: {
      tabChange(e){
          console.log("点击了:"+e)
      }
    },
    created() {
     // this.clientData = this.$route.params

    },
  }
</script>

<style>
</style>
