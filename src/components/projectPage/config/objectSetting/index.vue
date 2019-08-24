<template>
	<div>
		<div class="title">销售管控配置</div>
		<div class="setArea">
			<span style="font-size: 16px;">认筹-定金协议是否必填</span>
			<i-switch v-model='isrcdj'  @on-change="rcdjchange"></i-switch>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				isrcdj:false,
			}
		
		},
		created(){
			this.getrcdj();
		},
		methods: {
			rcdjchange(status) {
				// console.log(this.isrcdj)
				var i;
				i=status?0:1;
				console.log(i);
				this.$post('/config/updateSubscribeXy',{
					project_id:parseInt(this.$route.params.id),
					subscribe_xy:i
				}).then(res => {
					console.log(res);
				})
			},
			/* 
			* 获取认筹定金配置
			*  */
			getrcdj(){
				this.$post('/config/projectConfigSj',{
					project_id:parseInt(this.$route.params.id)
				}).then(res => {
				  // if (res.status_code !== 200) return this.$Message.error('获取配置失败！')
				  // console.log(res)
					if(res.config.subscribe_xy === 1){
						this.isrcdj = true;
						console.log(this.isrcdj)
					}
					// console.log(this.isrcdj)
				}).catch(err => {
				  this.$Message.error('获取配置失败！')
				})
			}
		},
	}
	
</script>

<style scoped>
	.title {
	  font-size: 20px;
	  text-align: left;
	  line-height: 20px;
	  padding-top: 20px;
	  padding-bottom: 20px;
	  padding-left: 30px;
	}
	.setArea{
		padding-bottom: 20px;
		padding-left: 70px;
	}
</style>
