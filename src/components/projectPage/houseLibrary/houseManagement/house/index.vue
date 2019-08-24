<template>
  <div class="house_form_container">
    <configPrice v-if="isConfig"></configPrice>
    <Tabs v-else :value="currentTab">
      <TabPane label="基础表单" name="base_form">
        <baseForm v-if="flag"
          @cancelEditHouse="cancelEditHouse"
          :currentBuildingInfo="currentBuildingInfo"
          :editHouseInfo="sentDatas"
          :isForbid="isForbid"
        ></baseForm>
      </TabPane>
      <TabPane v-if="isSale" label="买受人" name="buyer_form">
        <buyerForm v-if="flag1"
          @cancelEditHouse="cancelEditHouse"
          :editHouseInfo="sentDatas2"
          :currentBuildingInfo="currentBuildingInfo"
          :isForbid="isForbid"
        ></buyerForm>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
  import configPrice from './configPrice'
  import baseForm from './baseForm'
  import buyerForm from './buyerForm'

  export default {
    name: "index",
    components: {
      configPrice,
      baseForm,
      buyerForm,
			
    },
    data() {
      return {
        // 当前表单
        currentTab: 'base_form',
        isConfig: false,
        // 是否已售
        isSale: false,
				sentDatas:{ },
				sentDatas2:{ },
				flag:false,
				flag1:false,
      }
    },
    props: ['currentBuildingInfo', 'editHouseInfo','isForbid'],
    created() {
			console.log('进来的editinfo',this.editHouseInfo)
			this.findEidtHouseInfo()
			this.findOnlyPeopleInfo()
			
      // this.isSale = this.editHouseInfo.only_people
    },
    methods: {
      cancelEditHouse() {
        this.$emit('cancelEditHouse')
      },
			//获取编辑房源数据
			findEidtHouseInfo(){
				if(this.editHouseInfo.id){
					this.$http.post('/house/oneHouse',{house_id:this.editHouseInfo.id})
					.then(res => {
						console.log('editHouseInfo001',res.data.data.house)
						
						if (res.status !== 200){
							return this.$Message.error('获取房屋信息数据失败！')
						} 
						this.sentDatas = res.data.data.house
						this.flag = true;
						this.$Message.success('获取房屋信息数据成功！')
					}).catch(err => {
						this.$Message.error('获取房屋信息数据失败！')
						console.log('错误信息',err)
					})
				}
				 // this.flag = true;
			},
			//获取买受人数据
			findOnlyPeopleInfo(){
				if(this.editHouseInfo.id){
					this.$http.post('/house/oneOnlyPeople',{house_id:this.editHouseInfo.id})
					.then(res => {
						console.log('oneOnlyPeople001',res.data.data.only_people.length)
						if (res.data === '没有权限') {
						  this.$Modal.error({
						    title: '警告',
						    content: '没有权限'
						  })
						  return false
						}
						if (res.status !== 200){
							return this.$Message.error('获取买受人数据失败！')
						} 
						if(res.data.data.only_people.length !== 0){
							this.isSale = true;
							this.flag1 = true;
						}
						this.sentDatas2 = res.data.data
						
						// this.$Message.success('获取买受人数据成功！')
					}).catch(err => {
						this.$Message.error('获取买受人数据失败！')
						console.log('错误信息',err)
					})
				}
				// 
			},
			
    }

  }
</script>

<style lang="less" scoped>
  .house_form_container {
    width: 900px;
    /*height: 700px;*/
    background-color: #ffffff;
    padding: 20px 15px;
  }
</style>
