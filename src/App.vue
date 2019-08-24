<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created(){
    /*this.$post('/login/login',{
      phone:'15170493410',
      password:'123456'
    }).then(res=>{
      console.log('登录信息===',res)
      if (res.status_code!==200) return this.$Message.error('登录失败！')
      this.$Message.success('登录成功！')
    })*/
  }
}
</script>

<style>
#app {
	width: 100%;
	min-height: 100vh;
  font-family: '微软雅黑', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
